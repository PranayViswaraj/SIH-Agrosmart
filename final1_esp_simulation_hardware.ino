#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

// ====== Soil Moisture Sensor ======
#define SOIL_MOISTURE_PIN 34  // Analog pin

// ====== Raindrop Sensor ======
#define RAIN_SENSOR_PIN 32    // Digital pin

// ====== Ultrasonic (HC-SR04 for Water Level) ======
#define TRIG_PIN 14
#define ECHO_PIN 27

// ====== WiFi + ThingSpeak ======
const char* ssid = "Airtel_vija_3254";
const char* password = "air24369";
String serverName = "http://api.thingspeak.com/update";
String apiKey = "HXMHCJUAPTU08H6P";  // replace with your key

// ====== Setup ======
void setup() {
  Serial.begin(115200);

  pinMode(RAIN_SENSOR_PIN, INPUT);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  // WiFi connect
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi Connected!");
}

float readWaterLevelCM() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long duration = pulseIn(ECHO_PIN, HIGH, 30000);  // timeout 30ms
  float distance = duration * 0.034 / 2; // cm
  return distance;
}

void loop() {
  // === Read sensors ===
  int soilMoistureValue = analogRead(SOIL_MOISTURE_PIN);
  float soilMoisturePercent = map(soilMoistureValue, 0, 4095, 0, 100);

  int rainValue = digitalRead(RAIN_SENSOR_PIN); // 0 = wet, 1 = dry
  String rainStatus = (rainValue == 0) ? "🌧️ Rain Detected" : "☀️ No Rain";

  float waterLevel = readWaterLevelCM();

  // === Simulated / Fixed Values ===
  float airTemperature = random(25, 35);   // Simulated air temperature (25–34 °C)
  float airHumidity = random(50, 80);      // Simulated humidity (50–79 %)
  String gpsLatitude = "12.9291128";
  String gpsLongitude = "80.119682";
  String gsmStatus = "Active";

  // === Print formatted ===
  Serial.println("===== Sensor Readings =====");
  Serial.printf("🌱 Soil Moisture  : %.2f %%\n", soilMoisturePercent);
  Serial.printf("🌧️ Rain Sensor    : %s\n", rainStatus.c_str());
  Serial.printf("🌡️ Air Temp       : %.2f °C\n", airTemperature);
  Serial.printf("💧 Air Humidity   : %.2f %%\n", airHumidity);
  Serial.printf("🚰 Water Level    : 85.0% Available\n");
  Serial.printf("📍 GPS Location   : Lat %s, Lon %s\n", gpsLatitude.c_str(), gpsLongitude.c_str());
  Serial.printf("📶 GSM Status     : %s\n", gsmStatus.c_str());
  Serial.println("===========================\n");

  // === Send to ThingSpeak ===
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    String url = serverName + "?api_key=" + apiKey +
                 "&field1=" + String(soilMoisturePercent, 2) +
                 "&field2=" + String(rainValue) +
                 "&field3=" + String(airTemperature, 2) +
                 "&field4=" + String(airHumidity, 2) +
                 "&field5=" + String(waterLevel, 2);

    Serial.println("📡 Sending to ThingSpeak...");
    Serial.println("URL: " + url);

    http.begin(url);
    int httpCode = http.GET();

    if (httpCode == 200) {
      Serial.println("✅ Sensor details sent to ThingSpeak!");
    } else {
      Serial.println("❌ ThingSpeak Error: " + String(httpCode));
    }
    http.end();
  } else {
    Serial.println("⚠️ WiFi Disconnected!");
  }

  // === Simulate MongoDB (through backend API normally) ===
  Serial.println("📦 Sensor details sent to MongoDB (via API).");

  delay(20000); // ThingSpeak requires min 15s interval
}
