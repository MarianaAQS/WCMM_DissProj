/*****************************************************************************
*A WEARABLE CORTISOL MONITORING MICROSYSTEM
*DISSERTATION. BIOMEDICAL ENGINEERING. FEUP 
*MARIANA ALVES QUEIRÓS SANTOS | PROF. DR. JOSÉ MACHADO DA SILVA
*Final Code WCMM
*****************************************************************************/

#include <Wire.h>
#include <LMP91000.h>
#include <ArduinoBLE.h>

float sample[802]; //array para guardar as amostras de corrente
int count[5]; //contador para o numero de concentraçao
int indice = 0; //indice da n-esima amostra

bool ended = false;

float Concentration;
int oldConcentration = 0; 

const double v_tolerance = 33; 

LMP91000 lmp = LMP91000();

BLEService WCMMService ("19B10100-E8F2-537E-4F6C-D104768A1214");

BLEFloatCharacteristic cortisolLevel ("19B10101-E8F2-537E-4F6C-D104768A1214", BLERead | BLENotify);


void setup() 
{  
  Wire.begin();
  Serial.begin(115200);

  
//enable the potentiostat
  delay(50);
  lmp.standby();
  delay(50);
  initLMP();
  delay(2000); //warm-up time for the sensor


//initiliaze BLE   
 if (!BLE.begin()) 
  {
    Serial.println("starting BLE failed!");
    while (1);
    }

  BLE.setLocalName("WCMM");
  BLE.setAdvertisedService(WCMMService); // add the service UUID
  WCMMService.addCharacteristic(cortisolLevel); 
  BLE.addService(WCMMService);
  cortisolLevel.writeValue(oldConcentration); // set initial value for this characteristic

  BLE.advertise();

  Serial.println ("Bluetooth device active, waiting for connections...");
}


void loop() 
{

while(indice < 802) { //enquanto não tem amostras que chegue, segue o codigo normal
    
//startV(mV), endV(mV), stepV(mV), freq(Hz)
   Serial.println("Forward scan");
   runCV(-200, 600, 2, 25);
   Serial.println("Backward scan");
   runCV(600, -200, 2, 25);
   }


  if(indice >= 802 && ended == false) { //no fim vai ver as amostras
    int i;
    float maxi = 0;
    
    for(i = 0; i < 802; i++){

      if(sample[i] > -35 && sample[i] <= 42){ //se a corrente estiver entre estes valores, conta no histograma
        count[0]++;
      }

      if(sample[i] > -65 && sample[i] <= 91){ 
        count[1]++;
      }

      if(sample[i] > -163 && sample[i] <= 165){
        count[2]++;
      }
   
      if(sample[i] > -189 && sample[i] <= 257){
        count[3]++;
      }

      if(sample[i] > -189 && sample[i] <= 356){
        count[4]++;
      }
    }
    
    for(i = 0, indice = 0; i < 5; i++) { //verifica o max do histograma

      if(maxi < count[i]) {
        maxi = count[i];
        indice = i;
      }
    }
    
    //conclui a concentraçao
    if(indice == 0) {
      Serial.print("1 mM");
      Concentration = 1.0;
    }
    
        
    else if(indice == 1) {
      Serial.print("2.5 mM");
      Concentration = 2.0;
    }

    else if(indice == 2) {
      Serial.print("5 mM");
      Concentration = 5.0;
    }

    
    else if(indice == 3) {
      Serial.print("7.5 mM");
      Concentration = 7.0;
    }

     else if(indice == 4) {
      Serial.print("10 mM");
      Concentration = 10.0;
    }
    
    ended = true;
    indice = 802;
  }
  

// wait for a BLE central
BLEDevice central = BLE.central();

  // if a central is connected to the peripheral:
  if (central) {
    Serial.print(" \nConnected to central: ");
    // print the central's BT address:
    Serial.println(central.address());

     while (central.connected()) {
        updateConcentration();  
      } 
      
    Serial.print("Disconnected from central: ");
    Serial.println(central.address());
  }
}


void updateConcentration(){
  if (Concentration != oldConcentration)
  {
    Serial.println(Concentration);
    cortisolLevel.writeValue(Concentration); //update the cortisolLevel characteristic
    oldConcentration = Concentration;
  }
}



void initLMP()
{
  lmp.disableFET(); 
  lmp.setGain(2); // 3.5kOhm
  lmp.setRLoad(0); // 10 Ohm
  lmp.setIntRefSource(); //Sets the voltage reference source to supply voltage (Vdd).
  lmp.setIntZ(0); //Viz = 0.2*Vdd
  lmp.setThreeLead(); //3-lead amperometric cell mode                                 
}



void runCV(int16_t startV, int16_t endV, int16_t stepV, double freq)
{
  stepV = abs(stepV);
  freq = (uint16_t)(1000.0 / (2*freq));

  if(startV < endV) runCVForward(startV, endV, stepV, freq);
  else runCVBackward(startV, endV, stepV, freq);
}



void runCVForward(int16_t startV, int16_t endV,int16_t stepV, double freq)
{
  for (int16_t j = startV; j <= endV; j += stepV)
  {
    biasAndSample(j,freq);
    Serial.println();
  }
}



void runCVBackward(int16_t startV, int16_t endV, int16_t stepV, double freq)
{
  for (int16_t j = startV; j >= endV; j -= stepV)
  {
    biasAndSample(j,freq);
    Serial.println();
  }
}



void biasAndSample(int16_t voltage, double rate)
{
  Serial.print("Time(ms): "); Serial.print(millis()); 
  Serial.print(", Voltage(mV): "); Serial.print(voltage);

  setBiasVoltage(voltage);
  
  analogReadResolution(10);
  double tensao = lmp.getVoltage(analogRead(A0), 3.3, 10);
  double current = (tensao - 0.66) / 3500;
  Serial.print(", Vout(V): ");
  Serial.print(tensao);
  Serial.print(", Current(uA): ");
  Serial.print(current/pow(10,-6));

//guarda a corrente obtida
    sample[indice] = current/pow(10,-6); //guarda o valor de corrente
    indice++;
  
  delay(rate);
}



void setBiasVoltage(int16_t voltage)
{
  //define bias sign
  if(voltage < 0) lmp.setNegBias();
  else if (voltage > 0) lmp.setPosBias();
  else {} //do nothing

  //define bias voltage
  uint16_t Vdd = 3300;
  uint8_t set_bias = 0; //indice do TIA_BIAS

  int16_t setV = Vdd*TIA_BIAS[set_bias];// igual a 0
  voltage = abs(voltage);

  while(setV > voltage+v_tolerance || setV < voltage-v_tolerance)
  {
    set_bias++;
    if(set_bias > NUM_TIA_BIAS) return;  // if voltage > 0.792 V

    setV = Vdd*TIA_BIAS[set_bias];    
  }
  lmp.setBias(set_bias); 
}
