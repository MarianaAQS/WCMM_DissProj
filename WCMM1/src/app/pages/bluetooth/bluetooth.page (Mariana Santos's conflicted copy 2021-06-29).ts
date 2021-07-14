import { Component, NgModule, NgZone } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { Router, NavigationExtras } from '@angular/router';
import { ToastController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-bluetooth',
  templateUrl: './bluetooth.page.html',
  styleUrls: ['./bluetooth.page.scss'],
})




export class BluetoothPage {
  
  devices:any[] = [];
  statusMessage: string;

  constructor(
    public router: Router,
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    private ble:BLE, 
    private ngZone: NgZone) {}

    
    ionViewDidEnter() {
      console.log('ionViewDidEnter');
      this.Scan();
    }
    
    Scan() {
    this.setStatus('Scanning for Bluetooth LE Devices');
    this.devices = [];

    this.ble.scan([], 5).subscribe(
      device => this.onDeviceDiscovered(device),
      error => this.scanError(error)
    );


    setTimeout(this.setStatus.bind(this), 5000, 'Scan complete');
  }


  onDeviceDiscovered(device){
    console.log('Discovered' + JSON.stringify(device, null, 2));
    this.ngZone.run(()=>{
      this.devices.push(device);
      //console.log(device)
    });
  }
  
  
  // If location permission is denied, you'll end up here
  async scanError(error) {
    this.setStatus('Error ' + error);
    const toast = await this.toastCtrl.create({
      message: 'Error scanning for Bluetooth Low Energy devices',
      position: 'middle',
      duration: 5000
  });
  toast.present();
}

setStatus(message) {
  console.log(message);
  this.ngZone.run(() => {
    this.statusMessage = message;
  });
}

deviceSelected(device: any) {
    console.log(JSON.stringify(device.id) + ' selected');
    
      let navigationExtras: NavigationExtras = {
          queryParams: {
            device: JSON.stringify(device)
          }
      };
 
      this.navCtrl.navigateForward(['/detail-ble'],navigationExtras);
      

  }
}
