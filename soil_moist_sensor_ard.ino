#include <TinyGPS++.h>
#include <HardwareSerial.h>

// Create TinyGPS++ object
TinyGPSPlus gps;

// Use HardwareSerial2
HardwareSerial SerialGPS(2); // UART2: RX2 = GPIO16, TX2 = GPIO17

void setup() {
  Serial.begin(115200);          // Serial monitor
  SerialGPS.begin(9600, SERIAL_8N1, 16, 17); // GPS baudrate, RX, TX

  Serial.println("GPS Module Test for ESP32 WROOM-32");
}

void loop() {
  while (SerialGPS.available() > 0) {
    char c = SerialGPS.read();
    gps.encode(c);
  }

  if (gps.location.isUpdated()) {
    Serial.print("Latitude: ");
    Serial.println(gps.location.lat(), 6);
    Serial.print("Longitude: ");
    Serial.println(gps.location.lng(), 6);
    Serial.print("Satellites: ");
    Serial.println(gps.satellites.value());
    Serial.println("-------------------------");
  }
}
