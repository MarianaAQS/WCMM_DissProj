import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MedicacaoPageRoutingModule } from './medicacao-routing.module';

import { MedicacaoPage } from './medicacao.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MedicacaoPageRoutingModule
  ],
  declarations: [MedicacaoPage]
})
export class MedicacaoPageModule {}
