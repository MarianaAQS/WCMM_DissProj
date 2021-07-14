import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailBlePageRoutingModule } from './detail-ble-routing.module';

import { DetailBlePage } from './detail-ble.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailBlePageRoutingModule
  ],
  declarations: [DetailBlePage]
})
export class DetailBlePageModule {}
