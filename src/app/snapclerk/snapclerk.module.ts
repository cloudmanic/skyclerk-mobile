import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SnapclerkPage } from './snapclerk.page';

const routes: Routes = [
  {
    path: '',
    component: SnapclerkPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SnapclerkPage]
})
export class SnapclerkPageModule {}
