import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectAnAccountPage } from './select-an-account';

@NgModule({
  declarations: [
    SelectAnAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectAnAccountPage),
  ],
})
export class SelectAnAccountPageModule {}
