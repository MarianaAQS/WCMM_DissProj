import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { BLE } from '@ionic-native/ble/ngx';
import { NavigationExtras } from '@angular/router';


//BLuetooth UUIDs
const BLE_SERVICE = '19B10100-E8F2-537E-4F6C-D104768A1214';
const BLE_CHARACTERISTIC = '19B10101-E8F2-537E-4F6C-D104768A1214';

@Component({
  selector: 'app-detail-ble',
  templateUrl: './detail-ble.page.html',
  styleUrls: ['./detail-ble.page.scss'],

})



export class DetailBlePage {
  data: any;
  peripheral: any = {};
  statusMessage: string;
  concentration: number;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private ble: BLE,
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private ngZone: NgZone) {


    this.route.queryParams.subscribe(params => {
      if (params && params.device) {
        this.data = JSON.parse(params.device);


        this.ble.connect(this.data.id).subscribe(
          peripheral => this.onConnected(peripheral),
        );
      }

    });

  }



  ngOnInit() { }

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
    });

  }



  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }



  linkHome() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        device: JSON.stringify(this.data)
      }
    };

    this.router.navigate(['/home'], navigationExtras);





  }

}

