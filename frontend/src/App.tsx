import React, { useState } from "react";
import axios from "axios";

const PredictionForm = () => {
  const questions = [
    "Kendinizi son zamanlarda mutsuz hissediyor musunuz?",
    "Hayattan zevk alma oranınız azaldı mı?",
    "Yorgun veya enerjisiz hissediyor musunuz?",
    "Uyku düzeniniz bozuldu mu?",
    "İştahınızda belirgin bir azalma ya da artış var mı?",
  ];

  const [inputData, setInputData] = useState<any>([
    1, // 0 - Gender
    24, // 1 - Age
    0, // 2 - Profession
    3, // 3 - Academic Pressure
    2, // 4 - Work Pressure
    80, // 5 - CGPA
    5, // 6 - Study Satisfaction
    3, // 7 - Job Satisfaction
    0, // 8 - Dietary Habits
    1, // 9 - Degree
    0, // 10 - Have you ever had suicidal thoughts ?
    6.0, // 11 - Work/Study Hours
    1, // 12 - Financial Stress
    0, // 13 - Family History of Mental Illness
    1, // 14 - Sleep Category
  ]);

  const [customProfession, setCustomProfession] = useState("");
  const [results, setResults] = useState<any>(null);

  const isStudent = inputData[2] === 0;

  const handleChange = (index: number, value: any) => {
    const newInputData = [...inputData];
    newInputData[index] = value;
    setInputData(newInputData);
  };

  const handlePredict = async () => {
    const preparedInput = [...inputData];
    preparedInput[5] = preparedInput[5] / 10; // normalize CGPA

    try {
      const response = await axios.post("http://localhost:5001/predict", {
        input_data: preparedInput,
      });

      console.log("Backend Response:", response.data);
      setResults(response.data); // bütün modellerin sonuçlarını set et
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  return (
    <div className="w-screen py-10">
      <div className=" max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-md py-10 border border-slate-200">
        <h2 className="text-2xl font-bold text-center mb-6">
          Depresyon Tahmin Formu
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {/* Gender */}
          <div>
            <label className="block text-sm font-semibold mb-3">Cinsiyet</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="Gender"
                  checked={inputData[0] === 0}
                  onChange={() => handleChange(0, 0)}
                />
                <span className="ml-2">Kadın</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="Gender"
                  checked={inputData[0] === 1}
                  onChange={() => handleChange(0, 1)}
                />
                <span className="ml-2">Erkek</span>
              </label>
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-semibold mb-3">Yaş</label>
            <input
              type="number"
              value={inputData[1]}
              onChange={(e) => handleChange(1, parseInt(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Profession */}
          <div>
            <label className="block text-sm font-semibold mb-3">
              Profession (Meslek) - (etkisi tekrar kontrol edilmeli)
            </label>
            <select
              value={inputData[2]}
              onChange={(e) => handleChange(2, parseInt(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="0">Öğrenci</option>
              <option value="1">Diğer</option>
            </select>
            {inputData[2] === 1 && (
              <input
                type="text"
                placeholder="Meslek girin"
                value={customProfession}
                onChange={(e) => setCustomProfession(e.target.value)}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-3">
              Haftalık Çalışma Saati
            </label>
            <input
              type="number"
              value={inputData[11]}
              onChange={(e) => handleChange(11, parseInt(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Academic Pressure */}
          <div>
            <label className="block text-sm font-semibold mb-3">
              Academic Baskı (0-5)
            </label>

            <div>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4, 5].map((val, index) => (
                  <div
                    key={val}
                    className={`cursor-pointer px-3 py-1 rounded-full border  hover:bg-slate-100 hover:text-slate-900 text-sm font-medium transition h-11 w-11 rounded-lg border flex items-center justify-center ${
                      inputData[3] === index
                        ? "bg-slate-100 text-slate-900 font-bolder border-blue-200"
                        : "bg-slate-50 text-slate-400 border-transparent"
                    }`}
                    onClick={() => handleChange(3, val)}
                  >
                    {index}
                  </div>
                ))}
              </div>
            </div>
            {/* <p className="text-sm mt-1">{inputData[3]}</p> */}
          </div>
          {/* Academic Pressure */}
          <div>
            <label className="block text-sm font-semibold mb-3">
              Finansal Stres (0-5)
            </label>

            <div>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4, 5].map((val, index) => (
                  <div
                    key={val}
                    className={`cursor-pointer px-3 py-1 rounded-full border  hover:bg-slate-100 hover:text-slate-900 text-sm font-medium transition h-11 w-11 rounded-lg border flex items-center justify-center ${
                      inputData[12] === index
                        ? "bg-slate-100 text-slate-900 font-bolder border-blue-200"
                        : "bg-slate-50 text-slate-400 border-transparent"
                    }`}
                    onClick={() => handleChange(12, val)}
                  >
                    {index}
                  </div>
                ))}
              </div>
            </div>
            {/* <p className="text-sm mt-1">{inputData[3]}</p> */}
          </div>

          {/* Work Pressure */}
          <div>
            <label className="block text-sm font-semibold mb-3">
              Work Pressure (0-5) - (şuan bu alan etkilemiyor)
            </label>
            <div>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4, 5].map((val, index) => (
                  <div
                    key={val}
                    className={`cursor-pointer px-3 py-1 rounded-full border  hover:bg-slate-100 hover:text-slate-900 text-sm font-medium transition h-11 w-11 rounded-lg border flex items-center justify-center ${
                      inputData[4] === index
                        ? "bg-slate-100 text-slate-900 font-bolder border-blue-200"
                        : "bg-slate-50 text-slate-400 border-transparent"
                    }`}
                    onClick={() => handleChange(4, val)}
                  >
                    {index}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CGPA */}
          <div>
            <label className="block text-sm font-semibold mb-3">
              Ortalama başarı puanınız (0-100)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={inputData[5]}
              onChange={(e) => handleChange(5, parseFloat(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Study Satisfaction */}
          <div>
            <label className="block text-sm font-semibold mb-3">
              Çalışma Memnuniyeti (0-5)
            </label>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4, 5].map((val, index) => (
                <div
                  key={val}
                  className={`cursor-pointer px-3 py-1 rounded-full border  hover:bg-slate-100 hover:text-slate-900 text-sm font-medium transition h-11 w-11 rounded-lg border flex items-center justify-center ${
                    inputData[6] === index
                      ? "bg-slate-100 text-slate-900 font-bolder border-blue-200"
                      : "bg-slate-50 text-slate-400 border-transparent"
                  }`}
                  onClick={() => handleChange(6, val)}
                >
                  {index}
                </div>
              ))}
            </div>
          </div>

          {/* Job Satisfaction */}
          <div>
            <label className="block text-sm font-semibold mb-3">
              İş Memnuniyeti (0-5)
            </label>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4, 5].map((val, index) => (
                <div
                  key={val}
                  className={`cursor-pointer px-3 py-1  hover:bg-slate-100 hover:text-slate-900 text-sm font-medium transition h-11 w-11 rounded-lg border flex items-center justify-center ${
                    inputData[7] === index
                      ? "bg-slate-100 text-slate-900 font-bolder border-blue-200"
                      : "bg-slate-50 text-slate-400 border-transparent"
                  }`}
                  onClick={() => handleChange(7, val)}
                >
                  {index}
                </div>
              ))}
            </div>
          </div>

          {/* Sleep Category */}
          <div>
            <label className="block text-sm font-semibold mb-3">
              Uyku Durumu
            </label>
            <select
              value={inputData[14]}
              onChange={(e) => handleChange(14, parseInt(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="0">Az</option>
              <option value="1">İyi</option>
              <option value="2">Çok</option>
            </select>
          </div>

          {/* Dietary Habits */}
          <div>
            <label className="block text-sm font-semibold mb-3">
              Beslenme Durumu
            </label>
            <select
              value={inputData[8]}
              onChange={(e) => handleChange(8, parseInt(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="0">Düzensiz</option>
              <option value="1">Ilıman</option>
              <option value="2">Düzenli</option>
            </select>
          </div>

          {/* Degree */}
          <div>
            <label className="block text-sm font-semibold mb-3">Derece</label>
            <select
              value={isStudent ? inputData[9] : 3}
              disabled={!isStudent}
              onChange={(e) => handleChange(9, parseInt(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="0">Lisans</option>
              <option value="1">Yüksek Lisans</option>
              <option value="2">Doktora</option>
              <option value="3">Diğer</option>
            </select>
          </div>

          {/* Suicidal Thoughts */}
          <div>
            <label className="block text-sm font-semibold mb-3">
              Daha önce intihar etmeyi düşündünüz mü ?
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="SuicidalThoughts"
                  checked={inputData[10] === 0}
                  onChange={() => handleChange(10, 0)}
                />
                <span className="ml-2">Hayır</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="SuicidalThoughts"
                  checked={inputData[10] === 1}
                  onChange={() => handleChange(10, 1)}
                />
                <span className="ml-2">Evet</span>
              </label>
            </div>
          </div>
          {/* Family History of Mental Illness */}
          <div>
            <label className="block text-sm font-semibold mb-3">
              Ailenizde ruhsal hastalık geçmişi olan var mı ?
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="FammiltMental"
                  checked={inputData[13] === 0}
                  onChange={() => handleChange(13, 0)}
                />
                <span className="ml-2">Hayır</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="FammiltMental"
                  checked={inputData[13] === 1}
                  onChange={() => handleChange(13, 1)}
                />
                <span className="ml-2">Evet</span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="col-span-1 md:col-span-2">
            <button
              type="button"
              onClick={handlePredict}
              className="w-full bg-blue-600  p-3 rounded-lg hover:bg-blue-700"
            >
              Uygula
            </button>
          </div>
        </div>
        {results && (
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-4">
              🔍 Model Tahmin Sonuçları
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(results).map(([modelName, data]: any) => (
                <div
                  key={modelName}
                  className={`border rounded-xl p-4 shadow-md ${
                    data.probability >= 80
                      ? "bg-red-50 border-red-200"
                      : data.probability >= 60
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-green-50 border-green-200"
                  }`}
                >
                  <h4 className="font-semibold mb-2">{modelName}</h4>
                  <p>🎯 Model Doğruluk Oranı: %{data.accuracy}</p>
                  <p>🧠 Depresyon Olasılığı: %{data.probability}</p>
                  <p>
                    📈 Tahmin:{" "}
                    {data.prediction === 1 ? "Depresyonda" : "Normal"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionForm;
