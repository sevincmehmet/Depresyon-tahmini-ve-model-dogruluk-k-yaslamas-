# Gerekli kütüphaneleri içe aktar
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report
import xgboost as xgb
import joblib
import os
import warnings

warnings.filterwarnings(action='ignore', category=UserWarning, module='xgboost')

# ------------------------------ 3.1 Veri Seti Tanıtımı
print("\n* 3.1 VERİ SETİ TANITIMI")
df = pd.read_csv("data/depresion.csv")
print("\n* İlk 5 Satır:")
print(df.head())
print("\n* Veri Seti Bilgisi:")
print(df.info())
print("\n* Veri Seti Boyutu (satır x sütun):")
print(df.shape)

# ------------------------------ 3.2 Uyku Süresi Kategorisi
print("\n* 3.2 UYKU SÜRESİ KATEGORİSİ")
def categorize_sleep_duration(value):
    if isinstance(value, str):
        value = value.lower()
        if "less" in value:
            return "az"
        elif "-" in value:
            return "iyi"
        elif "more" in value:
            return "çok"
    return "bilinmiyor"

df["Sleep Category"] = df["Sleep Duration"].apply(categorize_sleep_duration)
print("\n* Uyku Kategorileri Dağılımı:")
print(df["Sleep Category"].value_counts())

# ------------------------------ 3.3 Gereksiz Sütun Temizliği
print("\n* 3.3 GEREKSİZ SÜTUNLARIN KALDIRILMASI")
df = df[df["Sleep Category"] != "bilinmiyor"]
df = df.drop(columns=["City"])
print("Kalan Sütunlar:")
print(df.columns.tolist())

# ------------------------------ 3.4 Kategorik Verilerin Kodlanması
print("\n* 3.4 KATEGORİK VERİLERİN DÖNÜŞTÜRÜLMESİ")
categorical_columns = [
    'Gender', 'Profession', 'Dietary Habits', 'Degree',
    'Have you ever had suicidal thoughts ?', 'Financial Stress',
    'Family History of Mental Illness', 'Sleep Category'
]
label_encoder = LabelEncoder()
for column in categorical_columns:
    df[column] = label_encoder.fit_transform(df[column])
print("\n* Etiketlenmiş Kategorik Sütunlar (ilk 5 satır):")
print(df[categorical_columns].head())

# ------------------------------ 3.5 Eksik Verilerin Median ile Doldurulması
print("\n* 3.5 EKSİK VERİLERİN İNCELENMESİ")
numeric_columns = df.select_dtypes(include=['float64', 'int64']).columns
print("Eksik veri sayısı (her sütun):")
print(df[numeric_columns].isnull().sum())

df[numeric_columns] = df[numeric_columns].fillna(df[numeric_columns].median())
print("Eksik veriler median ile dolduruldu.")

# ------------------------------ 3.6 Eğitim ve Test Verisinin Ayrılması
print("\n* 3.6 EĞİTİM VE TEST VERİSİ")
X = df.drop(columns=["Depression", "id", "Sleep Duration"])
y = df["Depression"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print("Eğitim ve Test veri boyutları:")
print(f"X_train: {X_train.shape}, X_test: {X_test.shape}")
print(f"y_train: {y_train.shape}, y_test: {y_test.shape}")

# ------------------------------ 4. MODEL EĞİTİMİ VE KARŞILAŞTIRMASI
print("\n* 4. MODEL EĞİTİMİ VE KARŞILAŞTIRMASI")
models = {
    "Logistic Regression": LogisticRegression(max_iter=1000),
    "Random Forest": RandomForestClassifier(),
    "K-Nearest Neighbors": KNeighborsClassifier(20),
    "Support Vector Machine": SVC(probability=True),
    "XGBoost": xgb.XGBClassifier(use_label_encoder=False, eval_metric="logloss"),
}
accuracy_results = {}
model_dir = "model"
os.makedirs(model_dir, exist_ok=True)

print("\n* Model Başarıları ve Sınıflandırma Raporları:")
for name, model in models.items():
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    accuracy_results[name] = acc

    print(f"\n=== {name} ===")
    print(f"Doğruluk (Accuracy): {acc * 100:.2f}%")
    print("Sınıflandırma Raporu:")
    print(classification_report(y_test, y_pred))

    if name == "XGBoost":
        model.save_model(os.path.join(model_dir, "xgboost_model.json"))
    else:
        model_path = os.path.join(model_dir, name.replace(" ", "_").lower() + ".pkl")
        joblib.dump(model, model_path)

# ------------------------------ 5. EN İYİ MODELİN RAPORU
best_model_name = max(accuracy_results, key=accuracy_results.get)
print(f"\n* En iyi model: {best_model_name} ({accuracy_results[best_model_name] * 100:.2f}%)")
print("\n* En iyi modelin sınıflandırma raporu:")
print(classification_report(y_test, models[best_model_name].predict(X_test)))

# ------------------------------ 6. Doğruluk Sonuçlarının Kaydı
with open("model_accuracy.txt", "w") as f:
    for name, acc in accuracy_results.items():
        f.write(f"{name}: {acc * 100:.2f}%\n")
