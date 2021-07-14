/*****************************************************************************
*A WEARABLE CORTISOL MONITORING MICROSYSTEM
*DISSERTATION. BIOMEDICAL ENGINEERING. FEUP 
*MARIANA ALVES QUEIRÓS SANTOS | PROF. DR. JOSÉ MACHADO DA SILVA
*Square Wave Voltammetry Technique
*****************************************************************************/

#include <Wire.h>
#include <LMP91000.h>

LMP91000 lmp = LMP91000();

const double v_tolerance = 33;

void setup() {
  
  Wire.begin();
  Serial.begin(115200);
  
  //enable the potentiostat
  delay(50);
  lmp.standby();
  delay(50);
  initLMP();
  delay(2000); //warm-up time for the sensor
}

void loop() 
{ 
//startV(mV), endV(mV), pulseAmp(mV), stepV(mV), freq(Hz)
   Serial.println("Forward scan");
   runSWV(-200, 600, 20, 2, 25); 
   Serial.println("Backward scan");
   runSWV(600, -200, 20, 2, 25);
}


void initLMP()
{
  lmp.disableFET();
  lmp.setGain(2); // 3.5kOhm
  lmp.setRLoad(0); // 10 Ohm
  lmp.setIntRefSource(); //Sets the voltage reference source to supply voltage (Vdd).
  lmp.setIntZ(0); //V(Iz) = 0.2*Vdd
  lmp.setThreeLead(); //3-lead amperometric cell mode                    
}


void runSWV(int16_t startV, int16_t endV, int16_t pulseAmp, int16_t stepV, double freq)
{
  stepV = abs(stepV);
  pulseAmp = abs(pulseAmp);
  freq = (uint16_t)(1000.0 / (2*freq));


  if(startV < endV) runSWVForward(startV, endV, pulseAmp, stepV, freq);
  else runSWVBackward(startV, endV, pulseAmp, stepV, freq);
}


void runSWVForward(int16_t startV, int16_t endV, int16_t pulseAmp,int16_t stepV, double freq)
{
  for (int16_t j = startV; j <= endV; j += stepV)
  {
    //positive pulse
    biasAndSample(j + pulseAmp,freq);
    Serial.println();

    //negative pulse
    biasAndSample(j - pulseAmp,freq);
    Serial.println();
  }
}


void runSWVBackward(int16_t startV, int16_t endV, int16_t pulseAmp,int16_t stepV, double freq)
{
  for (int16_t j = startV; j >= endV; j -= stepV)
  {
    //positive pulse
    biasAndSample(j + pulseAmp, freq);
    Serial.println();
    
    //negative pulse
    biasAndSample(j - pulseAmp, freq);
    Serial.println();
  }
}


void biasAndSample(int16_t voltage, double rate)
{
Serial.print("Time(ms): "); Serial.print(millis()); 
Serial.print(", Voltage(mV): "); Serial.print(voltage);
  
  setBiasVoltage(voltage);
   
  delay(rate);
  
  analogReadResolution(10);
  double tensao = lmp.getVoltage(analogRead(A0), 3.3, 10);
  double amperage = (tensao - 0.66) / 3500;
  Serial.print(", Vout(V): ");
  Serial.print(tensao);
  Serial.print(", Current(uA): ");
  Serial.print(amperage/pow(10,-6));
}


void setBiasVoltage(int16_t voltage)
{
  //define bias sign
  if(voltage < 0) lmp.setNegBias();
  else if (voltage > 0) lmp.setPosBias();
  else {} //do nothing

  //define bias voltage
  uint16_t Vdd = 3300;
  uint8_t set_bias = 0; 

  int16_t setV = Vdd*TIA_BIAS[set_bias]; 
  voltage = abs(voltage);

  while(setV > voltage+v_tolerance || setV < voltage-v_tolerance)
  {
    set_bias++;
    if(set_bias > NUM_TIA_BIAS) return;  // if voltage > 0.792 V

    setV = Vdd*TIA_BIAS[set_bias];    
  }

  lmp.setBias(set_bias);
}
