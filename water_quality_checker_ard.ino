#define TdsSensorPin A0
#define VREF 5.0          // Arduino UNO/Nano works on 5V
#define SCOUNT 30         // sample size

int analogBuffer[SCOUNT];  
int analogBufferIndex = 0;

float getMedianNum(int bArray[], int len) {
  int bTab[len];
  for (int i = 0; i < len; i++) bTab[i] = bArray[i];
  for (int j = 0; j < len - 1; j++) {
    for (int i = 0; i < len - j - 1; i++) {
      if (bTab[i] > bTab[i + 1]) {
        int temp = bTab[i];
        bTab[i] = bTab[i + 1];
        bTab[i + 1] = temp;
      }
    }
  }
  if ((len & 1) > 0) return bTab[(len - 1) / 2];
  else return (bTab[len / 2] + bTab[len / 2 - 1]) / 2.0;
}

void setup() {
  Serial.begin(9600);
  Serial.println("===================================");
  Serial.println("       WATER QUALITY TESTER        ");
  Serial.println("   (TDS Sensor Only - Arduino)     ");
  Serial.println("===================================");
}

void loop() {
  // Read sensor values into buffer
  analogBuffer[analogBufferIndex] = analogRead(TdsSensorPin);
  analogBufferIndex++;
  if (analogBufferIndex == SCOUNT) analogBufferIndex = 0;

  // Median filter
  float averageADC = getMedianNum(analogBuffer, SCOUNT);
  float voltage = averageADC * (VREF / 1024.0); // 10-bit ADC

  // Convert voltage to TDS (ppm)
  float tdsValue = (133.42 * voltage * voltage * voltage
                  - 255.86 * voltage * voltage
                  + 857.39 * voltage) * 0.5;

  // Print results
  Serial.println("-----------------------------------");
  Serial.print(" Voltage   : ");
  Serial.print(voltage, 2);
  Serial.println(" V");

  Serial.print(" TDS Value : ");
  Serial.print(tdsValue, 0);
  Serial.println(" ppm");

  if (tdsValue < 300) Serial.println(" 💧 Water Quality: Excellent (Safe for drinking)");
  else if (tdsValue < 600) Serial.println(" 💧 Water Quality: Good");
  else if (tdsValue < 900) Serial.println(" ⚠️ Water Quality: Fair");
  else if (tdsValue < 1200) Serial.println(" ⚠️ Water Quality: Poor");
  else Serial.println(" ❌ Water Quality: Not suitable for drinking");

  Serial.println("-----------------------------------");

  delay(1000);
}
