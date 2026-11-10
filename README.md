# Depresyon Tahmini ve Model Doğruluk Karşılaştırması

**Beş makine öğrenmesi modelini aynı veri setinde eğitip doğruluklarını karşılaştıran, sonucu bir React arayüzünden tahmin olarak sunan uçtan uca proje.**

> Eğitim amaçlı bir projedir; tıbbi bir teşhis aracı değildir.

## Ne yapıyor?

1. **Eğitim (`backend/main.py`):** ~27.900 satırlık öğrenci depresyonu veri setini temizliyor (uyku süresini kategoriye çeviriyor, kategorik sütunları `LabelEncoder` ile sayısallaştırıyor), %80/%20 ayırıp beş modeli eğitiyor ve kaydediyor.
2. **API (`backend/app.py`):** Flask, `POST /predict` uç noktası. Kayıtlı bütün modelleri yükleyip aynı girdi için her modelin tahminini, depresyon olasılığını (%) ve test doğruluğunu döndürüyor.
3. **Arayüz (`frontend/`):** React + TypeScript + Tailwind form. Kullanıcı bilgileri girince modellerin tahminleri yan yana görünüyor.

## Sonuçlar (test seti, %20)

| Model | Doğruluk |
|---|---|
| Logistic Regression | %84,47 |
| Random Forest | %84,40 |
| Support Vector Machine | %84,26 |
| XGBoost | %83,93 |
| K-Nearest Neighbors | %80,71 |

En basit model (Logistic Regression) en karmaşık modellerle aynı seviyede. Bu veri setinde özellikler büyük ölçüde doğrusal ayrışabiliyor; karmaşık model seçmek için ek bir gerekçe yok.

## Çalıştırma

```bash
# Backend
cd backend
pip install -r requirements.txt
python main.py     # modelleri eğitir ve model/ klasörüne kaydeder (hazır modeller repoda da var)
python app.py      # http://localhost:5001

# Frontend (ayrı terminalde)
cd frontend
yarn install
yarn dev
```

## Teknolojiler

Python · pandas · scikit-learn · XGBoost · Flask · React · TypeScript · Tailwind CSS

## Eksikler

Doğruluk tek bir ayırmada ölçülüyor (çapraz doğrulama yok); sınıf dengesi, precision/recall gibi metrikler arayüzde gösterilmiyor.
