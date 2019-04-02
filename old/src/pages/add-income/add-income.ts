import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { EditLedgerPage } from '../edit-ledger/edit-ledger';
import { OverviewPage } from '../overview/overview';

@IonicPage()
@Component({
  selector: 'page-add-income',
  templateUrl: 'add-income.html',
})
export class AddIncomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  openOverviewPage(){
    this.navCtrl.push(OverviewPage);
  }
  openEditLedgerPage(){
    this.navCtrl.push(EditLedgerPage);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad AddIncomePage');
  }

}
