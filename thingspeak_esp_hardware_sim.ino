#include <WiFi.h>
#include <HTTPClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <DHT.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// ====== OLED Setup ======
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

// ====== DS18B20 Soil Temp ======
#define ONE_WIRE_BUS 4  // GPIO4
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature soilTemp(&oneWire);

// ====== DHT22 Air Temp & Humidity ======
#define DHTPIN 15       // GPIO15
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

// ====== Ultrasonic (HC-SR04 for Water Level) ======
#define TRIG_PIN 14
#define ECHO_PIN 27

// ====== Potentiometer (simulate salinity/moisture) ======
#define POT_PIN 35   // ADC pin

// ====== WiFi + ThingSpeak ======
const char* ssid = "YOUR_WIFI_SSID";          // 🔹 Replace with your WiFi SSID
const char* password = "YOUR_WIFI_PASSWORD";  // 🔹 Replace with your WiFi Password
String serverName = "http://api.thingspeak.com/update";
String apiKey = "YOUR_THINGSPEAK_WRITE_API_KEY";  // 🔹 Replace with ThingSpeak Write API Key

// ====== Setup ======
void setup() {
  Serial.begin(115200);

  // Init OLED
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("SSD1306 allocation failed");
    for (;;);
  }
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);

  // Init sensors
  soilTemp.begin();
  dht.begin();
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
  soilTemp.requestTemperatures();
  float soilTemperature = soilTemp.getTempCByIndex(0);

  float airTemperature = dht.readTemperature();
  float airHumidity = dht.readHumidity();

  float waterLevel = readWaterLevelCM();

  int potValue = analogRead(POT_PIN);
  float salinityPercent = map(potValue, 0, 4095, 0, 100);

  // === Print formatted ===
  Serial.println("===== Sensor Readings =====");
  Serial.printf("🌱 Soil Temp     : %.2f °C\n", soilTemperature);
  Serial.printf("🌤 Air Temp      : %.2f °C\n", airTemperature);
  Serial.printf("💧 Air Humidity  : %.2f %%\n", airHumidity);
  Serial.printf("🚰 Water Level   : %.2f cm\n", waterLevel);
  Serial.printf("🧂 Salinity      : %.2f %%\n", salinityPercent);
  Serial.println("===========================\n");

  // === OLED Display ===
  display.clearDisplay();
  display.setCursor(0, 0);
  display.setTextSize(1);

  display.printf("Soil Temp: %.2fC\n", soilTemperature);
  display.printf("Air Temp : %.2fC\n", airTemperature);
  display.printf("Air Hum  : %.2f%%\n", airHumidity);
  display.printf("WaterLvl : %.2fcm\n", waterLevel);
  display.printf("Salinity : %.2f%%\n", salinityPercent);

  display.display();

  // === Send to ThingSpeak ===
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    String url = serverName + "?api_key=" + apiKey +
                 "&field1=" + String(soilTemperature, 2) +
                 "&field2=" + String(airTemperature, 2) +
                 "&field3=" + String(airHumidity, 2) +
                 "&field4=" + String(waterLevel, 2) +
                 "&field5=" + String(salinityPercent, 2);

    http.begin(url);
    int httpCode = http.GET();

    if (httpCode > 0) {
      Serial.println("📡 ThingSpeak Update: " + String(httpCode));
    } else {
      Serial.println("❌ Error sending data: " + http.errorToString(httpCode));
    }
    http.end();
  } else {
    Serial.println("⚠️ WiFi Disconnected!");
  }

  delay(20000); // ThingSpeak requires minimum 15s interval
}
