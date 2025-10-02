// Pin connections
int rainDigitalPin = 2;   // DO pin connected to D2
int rainAnalogPin  = A0;  // AO pin connected to A0

int rainDigital;
int rainAnalog;

void setup() {
  Serial.begin(9600);          // Start Serial Monitor
  pinMode(rainDigitalPin, INPUT);
}

void loop() {
  // Read Digital Output
  rainDigital = digitalRead(rainDigitalPin);

  // Read Analog Output
  rainAnalog = analogRead(rainAnalogPin);

  // Print both values
  Serial.print("Analog Value: ");
  Serial.print(rainAnalog);

  Serial.print(" | Digital Value: ");
  Serial.println(rainDigital);

  // Simple condition using digital output
  if (rainDigital == LOW) {
    Serial.println("💧 Rain detected!");
  } else {
    Serial.println("☀️ No rain detected.");
  }

  delay(1000);  // wait 1 sec
}
