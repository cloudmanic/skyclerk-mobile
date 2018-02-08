import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AddExpensePage } from '../add-expense/add-expense';
import { AddIncomePage } from '../add-income/add-income';
import { ViewAttachmentPage } from '../view-attachment/view-attachment';

@IonicPage()
@Component({
  selector: 'page-overview',
  templateUrl: 'overview.html',
})
export class OverviewPage {
  tabs: string = "ledgers";
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  openAddExpensePage(){
    this.navCtrl.push(AddExpensePage)
  }
  openAddIncomePage(){
    this.navCtrl.push(AddIncomePage)
  }
  openViewAttachmentPage(){
    this.navCtrl.push(ViewAttachmentPage)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OverviewPage');
  }

}
