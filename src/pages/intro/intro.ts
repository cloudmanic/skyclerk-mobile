import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { CreateAccountPage } from '../create-account/create-account';
import { LoginPage } from '../login/login';
import { SelectAnAccountPage } from '../select-an-account/select-an-account';

@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  openCreateAccountPage(){
    this.navCtrl.push(CreateAccountPage);
  }
  openLoginPage(){
    this.navCtrl.push(LoginPage);
  }
  openSelectAnAccountPage(){
    this.navCtrl.push(SelectAnAccountPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IntroPage');
  }

}
