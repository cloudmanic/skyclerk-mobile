import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AddIncomePage } from '../add-income/add-income';

@IonicPage()
@Component({
  selector: 'page-edit-ledger',
  templateUrl: 'edit-ledger.html',
})
export class EditLedgerPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  openAddIncomePage(){
    this.navCtrl.push(AddIncomePage)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditLedgerPage');
  }

}
