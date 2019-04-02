import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { IntroPage } from '../intro/intro';

@IonicPage()
@Component({
  selector: 'page-snapclerk',
  templateUrl: 'snapclerk.html',
})
export class SnapclerkPage {
  tabs: string = "snapcheck";
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  openIntroPage(){
    this.navCtrl.push(IntroPage)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SnapclerkPage');
  }

}
