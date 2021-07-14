import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailBlePage } from './detail-ble.page';

const routes: Routes = [
  {
    path: '',
    component: DetailBlePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailBlePageRoutingModule {}
