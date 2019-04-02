import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { OverviewPage } from '../overview/overview';

@IonicPage()
@Component({
  selector: 'page-select-an-account',
  templateUrl: 'select-an-account.html',
})
export class SelectAnAccountPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  openOverviewPage(){
    this.navCtrl.push(OverviewPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectAnAccountPage');
  }

}
