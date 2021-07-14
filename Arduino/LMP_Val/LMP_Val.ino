/*****************************************************************************
*A WEARABLE CORTISOL MONITORING MICROSYSTEM
*DISSERTATION. BIOMEDICAL ENGINEERING. FEUP 
*MARIANA ALVES QUEIRÓS SANTOS | PROF. DR. JOSÉ MACHADO DA SILVA
*LMP91000 Validation Test with Potentiometer
*****************************************************************************/

#include <LMP91000.h>
#include <Wire.h>

LMP91000 lmp = LMP91000();

void setup()
{
  Wire.begin();
  Serial.begin(115200);

//  lmp.standby();
  delay(1000);

 lmp.disableFET(); 
  lmp.setGain(2); // 3.5kOhm
  lmp.setRLoad(0); // 10 Ohm
  lmp.setIntRefSource(); //Sets the voltage reference source to supply voltage (Vdd).
  lmp.setIntZ(1); //V(Iz) = 0.5*Vdd
  lmp.setThreeLead(); //3-lead amperometric cell mode                  
  lmp.setBias(11);
  lmp.setPosBias(); //Vwe > Vre           setNegBias(); //Vwe < Vre (default)                   
}


void loop()
{
  analogReadResolution(10);
 double voltage = lmp.getVoltage(analogRead(A0), 3.3, 10);

 Serial.print(voltage);
 Serial.print("V\n");
  
  delay(1000);
}
