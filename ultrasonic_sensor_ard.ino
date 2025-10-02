// Simulated Ultrasonic Readings (Random Generator)

// Tank thresholds
int fullThreshold = 5;     // cm or less → Tank Full
int midThreshold = 15;     // cm or less → Tank Mid
int emptyThreshold = 30;   // more than this → Tank Empty

// Array of 30 values
const int numReadings = 30;
int distanceArray[numReadings];

void setup() {
  Serial.begin(9600);
  randomSeed(analogRead(0)); // seed randomness

  Serial.println("==================================================");
  Serial.println("       SIMULATED WATER LEVEL SENSOR DATA          ");
  Serial.println("==================================================");
  Serial.print("FULL   : <= "); Serial.print(fullThreshold); Serial.println(" cm");
  Serial.print("MID    : <= "); Serial.print(midThreshold); Serial.println(" cm");
  Serial.print("EMPTY  : > "); Serial.print(emptyThreshold); Serial.println(" cm");
  Serial.println("==================================================\n");

  // Generate 30 random distance values (between 1–40 cm)
  for (int i = 0; i < numReadings; i++) {
    distanceArray[i] = random(1, 41); // random distance from 1 to 40 cm
  }

  // Print results
  Serial.println("\n================ RESULTS ================");
  for (int i = 0; i < numReadings; i++) {
    Serial.print("Reading "); 
    Serial.print(i + 1);
    Serial.print(": "); 
    Serial.print(distanceArray[i]); 
    Serial.print(" cm --> ");

    if (distanceArray[i] <= fullThreshold) {
      Serial.println("FULL ✅");
    } else if (distanceArray[i] <= midThreshold) {
      Serial.println("MID ⚠️");
    } else if (distanceArray[i] > emptyThreshold) {
      Serial.println("EMPTY ❌");
    } else {
      Serial.println("LOW-MID ⏳");
    }
  }
  Serial.println("=========================================\n");
}

void loop() {
  // Nothing here — only simulate once
}
