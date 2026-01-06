from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import xgboost as xgb
import numpy as np
import os

# Flask uygulamasını başlat
app = Flask(__name__)
CORS(app)  # CORS’u aktifleştir, frontend erişebilsin

model_dir = "model"  # Kaydedilen model dosyalarının klasörü

# ------------------------------
# Tüm modelleri yükleyen fonksiyon
def load_all_models():
    models = {}
    try:
        # Sklearn modellerini yükle
        models["Logistic Regression"] = joblib.load(os.path.join(model_dir, "logistic_regression.pkl"))
        models["Random Forest"] = joblib.load(os.path.join(model_dir, "random_forest.pkl"))
        models["K-Nearest Neighbors"] = joblib.load(os.path.join(model_dir, "k-nearest_neighbors.pkl"))
        models["Support Vector Machine"] = joblib.load(os.path.join(model_dir, "support_vector_machine.pkl"))

        # XGBoost modelini yükle (json formatı)
        xgb_model = xgb.XGBClassifier()
        xgb_model.load_model(os.path.join(model_dir, "xgboost_model.json"))
        models["XGBoost"] = xgb_model

    except Exception as e:
        print("Model(ler) yüklenirken hata:", e)
    return models

# ------------------------------
# Model doğruluklarını dosyadan okuyan fonksiyon
def get_all_model_accuracies():
    accuracies = {}
    try:
        with open("model_accuracy.txt", "r") as f:
            for line in f:
                name, acc = line.strip().split(":")
                accuracies[name.strip()] = float(acc.replace("%", "").strip())
    except Exception as e:
        print("Doğruluk dosyası okunurken hata:", e)
    return accuracies

# ------------------------------
# Gelen input'u modelin anlayacağı formata çevir
def prepare_input(data):
    return np.array(data).reshape(1, -1)

# ------------------------------
# Tahmin API'si
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()  # JSON al
    prepared_input = prepare_input(data['input_data'])  # input'u hazırla

    models = load_all_models()  # Tüm modelleri yükle
    accuracies = get_all_model_accuracies()  # Model doğruluklarını al
    results = {}

    for name, model in models.items():
        # Model ile tahmin yap
        prediction = int(model.predict(prepared_input)[0])
        probability = float(model.predict_proba(prepared_input)[0][1]) * 100
        accuracy = accuracies.get(name, 0.0)

        # Sonucu sözlüğe ekle
        results[name] = {
            "prediction": prediction,
            "probability": round(probability, 2),
            "accuracy": round(accuracy, 2)
        }

    return jsonify(results)  # JSON olarak dön

# ------------------------------
if __name__ == '__main__':
    # Sunucuyu başlat
    app.run(debug=True, host='0.0.0.0', port=5001)
