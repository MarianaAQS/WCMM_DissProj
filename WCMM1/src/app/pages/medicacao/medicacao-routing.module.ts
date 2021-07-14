import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MedicacaoPage } from './medicacao.page';

const routes: Routes = [
  {
    path: '',
    component: MedicacaoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedicacaoPageRoutingModule {}
