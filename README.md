# 🍊 AI Fruit Classifier

**AI Fruit Classifier** är en modern, cloud-native applikation som kombinerar väderdata, bildigenkänning och artificiell intelligens för att klassificera frukter automatiskt. Genom att analysera bilder med **AWS Rekognition** och hämta realtidsdata från **OpenWeatherMap API**, genererar systemet fruktobjekt som hanteras via ett **RESTful API** byggt med Express.

Projektet är containeriserat med Docker och distribueras via AWS ECS. Det är ett praktiskt exempel på hur man integrerar externa API:er och AI-tjänster i en mikrotjänstarkitektur.

---

## 🚀 Projektöversikt

Detta projekt utvecklades som en del av en cloud computing-kurs med målet att demonstrera hur AI och molntjänster kan kombineras i en skalbar applikation. Genom att ladda upp en bild – t.ex. på en frukt – returnerar systemet vad bilden föreställer, med hjälp av en tränad modell i **AWS SageMaker**.

---

## 🧠 Funktioner

- 🔍 **Bildklassificering av frukter** via AI-modell i AWS SageMaker
- 🌤️ **Väderanalys** via OpenWeatherMap API
- 📷 **Bildigenkänning** med AWS Rekognition
- 🌐 **RESTful API** dokumenterat med Swagger
- 🐳 **Docker-containerisering** för enkel distribution
- ☁️ **AWS-integrerad arkitektur** med ECS, S3, SageMaker och CloudWatch
- 🧪 Grundläggande testning och loggning

---

## 🖼️ Exempelanvändning

Skicka en POST-request till `/predict` med en bild:

```bash
curl -X POST http://<API-ENDPOINT>/predict \
  -F "image=@banana.jpg"
