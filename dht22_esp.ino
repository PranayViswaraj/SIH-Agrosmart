#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

// ====== DHT22 Setup ======
#define DHTPIN 2        // Data pin connected to Arduino digital pin 2
#define DHTTYPE DHT22   // DHT 22 (AM2302)

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  Serial.println("DHT22 Sensor Reading Test");

  dht.begin();
}

void loop() {
  // Read humidity and temperature
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();      // Celsius
  float temperatureF = dht.readTemperature(true); // Fahrenheit

  // Check if reading failed
  if (isnan(humidity) || isnan(temperature) || isnan(temperatureF)) {
    Serial.println("❌ Failed to read from DHT22 sensor!");
    delay(2000);
    return;
  }

  // Print results
  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.print(" %  |  Temperature: ");
  Serial.print(temperature);
  Serial.print(" °C  ");
  Serial.print(temperatureF);
  Serial.println(" °F");

  delay(2000); // update every 2 seconds
}