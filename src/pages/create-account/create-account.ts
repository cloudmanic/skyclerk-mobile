import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { IntroPage } from '../intro/intro';
import { SelectAnAccountPage } from '../select-an-account/select-an-account';

@IonicPage()
@Component({
  selector: 'page-create-account',
  templateUrl: 'create-account.html',
})
export class CreateAccountPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  openIntroPage(){
    this.navCtrl.push(IntroPage);
  }
  openSelectAnAccountPage(){
    this.navCtrl.push(SelectAnAccountPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateAccountPage');
  }

}
