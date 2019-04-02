import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { IntroPage } from '../intro/intro';
import { CreateAccountPage } from '../create-account/create-account';
import { SelectAnAccountPage } from '../select-an-account/select-an-account';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  openIntroPage(){
    this.navCtrl.push(IntroPage);
  }
  openCreateAccountPage(){
    this.navCtrl.push(CreateAccountPage);
  }

  openSelectAnAccountPage(){
    this.navCtrl.push(SelectAnAccountPage);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
