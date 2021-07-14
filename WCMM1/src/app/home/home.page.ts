import { Component, NgZone } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { SMS } from '@ionic-native/sms/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BLE } from '@ionic-native/ble/ngx';

import { varSession } from "src/providers/varSession";

//BLuetooth UUIDs
const BLE_SERVICE = '19B10100-E8F2-537E-4F6C-D104768A1214';
const BLE_CHARACTERISTIC = '19B10101-E8F2-537E-4F6C-D104768A1214';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})




export class HomePage {

  linkMapaTemp: string;

  dadosSensor: string;
  nomePerfil: string;


  today = Date.now();
  data: any;
  peripheral: any = {};
  statusMessage: string;
  concentration: number;

  concentrationLimite: number;



  constructor(
    private geolocation: Geolocation,
    private sms: SMS,
    private toast: ToastController,
    public sessionVar: varSession,
    public route: ActivatedRoute,
    private ble: BLE,
    private ngZone: NgZone
  ) {


    this.concentrationLimite = sessionVar.cortisol;


    this.route.queryParams.subscribe(params => {
      if (params && params.device) {
        this.data = JSON.parse(params.device);

        this.dadosSensor = this.data.id;


        this.ble.connect(this.data.id).subscribe(
          peripheral => this.onConnected(peripheral),
        );


      }
      else
        this.dadosSensor = "Não ligado";
    });

  }


  onConnected(peripheral) {



    this.peripheral = peripheral;
    this.setStatus('Connected to ' + (peripheral.name || peripheral.id));
    this.ble.startNotification(this.peripheral.id, BLE_SERVICE, BLE_CHARACTERISTIC).subscribe(
      data => this.onValueChange(data),

    )

    this.ble.read(this.peripheral.id, BLE_SERVICE, BLE_CHARACTERISTIC).then(
      data => this.onValueChange(data),
    )
  }

  onValueChange(buffer: ArrayBuffer) {
    var data = new Float32Array(buffer);
    console.log(data[0]);

    this.ngZone.run(() => {
      this.concentration = data[0];

      if (this.concentration > this.concentrationLimite)
        this.sendSMS();


    });

  }

  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }




  sendSMS() {

    this.geolocation.getCurrentPosition({
      timeout: 60000,
      enableHighAccuracy: true
    }).then((res) => {
      var latitude = res.coords.latitude;
      var longitude = res.coords.longitude;
      this.linkMapaTemp = "https://www.google.com/maps/search/?api=1&query=" + latitude + "," + longitude;


      var options: {
        replaceLineBreaks: true,
        android: {
          intent: 'INTENT'
        }
      }
  
      try {
        this.sms.send(String(this.sessionVar.phone1), this.sessionVar.mensagemSMS + " " + this.linkMapaTemp, options);
        const toast = this.toast.create({
          message: 'Alert was sent!',
          duration: 3000
        });
      }
  
      catch (e) {
        const toast = this.toast.create({
          message: 'Alert was not sent!',
          duration: 3000
        });
      }
  
      try {
        this.sms.send(String(this.sessionVar.phone2), this.sessionVar.mensagemSMS + " " + this.linkMapaTemp, options);
        const toast = this.toast.create({
          message: 'Alert was sent!',
          duration: 3000
        });
      }
  
      catch (e) {
        const toast = this.toast.create({
          message: 'Alert was not sent!',
          duration: 3000
        });
      }
  
      try {
        this.sms.send(String(this.sessionVar.phone3), this.sessionVar.mensagemSMS + " " + this.linkMapaTemp, options);
        const toast = this.toast.create({
          message: 'Alert was sent!',
          duration: 3000
        });
      }
  
      catch (e) {
        const toast = this.toast.create({
          message: 'Alert was not sent!',
          duration: 3000
        });
      }



    }).catch((e) => {
      console.log(e);
    });
   

  }

}


