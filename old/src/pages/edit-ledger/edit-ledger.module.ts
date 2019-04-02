import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditLedgerPage } from './edit-ledger';

@NgModule({
  declarations: [
    EditLedgerPage,
  ],
  imports: [
    IonicPageModule.forChild(EditLedgerPage),
  ],
})
export class EditLedgerPageModule {}
