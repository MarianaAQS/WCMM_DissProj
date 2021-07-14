/*****************************************************************************
*A WEARABLE CORTISOL MONITORING MICROSYSTEM
*DISSERTATION. BIOMEDICAL ENGINEERING. FEUP 
*MARIANA ALVES QUEIRÓS SANTOS | PROF. DR. JOSÉ MACHADO DA SILVA
*LMP91000 - Temperature Measurement
*****************************************************************************/

#include <LMP91000.h>
#include <Wire.h>

LMP91000 lmp = LMP91000();

void setup() {
    Wire.begin();
  Serial.begin(115200);
   
   lmp.measureCell();
}

void loop() {
analogReadResolution(10);
  
 double voltage = analogRead(A0)*(3.3 / 1023);
 double temp = (voltage-1.5622)/(-0.00816);
  Serial.print(voltage);
  Serial.print(" V ; ");

  Serial.print(temp);
  Serial.print(" C \n");
  delay(1000);
}
