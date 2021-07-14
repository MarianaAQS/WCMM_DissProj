import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BLE } from '@ionic-native/ble/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { SMS } from '@ionic-native/sms/ngx';

import { varSession } from "../providers/varSession";


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [BLE, Geolocation, Camera, SMS, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },varSession],
  bootstrap: [AppComponent],
})
export class AppModule {}
