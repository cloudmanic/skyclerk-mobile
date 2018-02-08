import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { OverviewPage } from '../overview/overview';
import { EditLedgerPage } from '../edit-ledger/edit-ledger';

@IonicPage()
@Component({
  selector: 'page-add-expense',
  templateUrl: 'add-expense.html',
})
export class AddExpensePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  openOverviewPage(){
    this.navCtrl.push(OverviewPage);
  }
  openEditLedgerPage(){
    this.navCtrl.push(EditLedgerPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddExpensePage');
  }

}
