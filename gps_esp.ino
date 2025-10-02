float baseLat = 12.9891120;
float baseLon = 79.9718060;

int offset = 0;  // will change the last 2 digits

unsigned long startTime;

void setup() {
  Serial.begin(9600);   // Set Serial Monitor to 9600
  startTime = millis();

  Serial.println("===================================");
  Serial.println("     SIMULATED GPS (7 DECIMALS)    ");
  Serial.println("===================================");
}

void loop() {
  // Add offset only in the last 2 digits of the 7th decimal place
  float lat = baseLat + (offset * 0.0000001);  
  float lon = baseLon + (offset * 0.0000001);

  // Timestamp (hh:mm:ss)
  unsigned long elapsedSec = (millis() - startTime) / 1000;
  int hours = (elapsedSec / 3600) % 24;
  int minutes = (elapsedSec / 60) % 60;
  int seconds = elapsedSec % 60;

  Serial.println("-----------------------------------");
  Serial.print(" Update #");
  Serial.println(offset + 1);

  Serial.print(" Time      : ");
  if (hours < 10) Serial.print("0");
  Serial.print(hours); Serial.print(":");
  if (minutes < 10) Serial.print("0");
  Serial.print(minutes); Serial.print(":");
  if (seconds < 10) Serial.print("0");
  Serial.println(seconds);

  Serial.print(" Latitude  : ");
  Serial.println(lat, 7);   // 7 decimal places
  Serial.print(" Longitude : ");
  Serial.println(lon, 7);   // 7 decimal places
  Serial.println("-----------------------------------");

  offset++;
  if (offset > 99) offset = 0;  // last 2 digits cycle 00 → 99

  delay(1000); // update every 1 sec
}
