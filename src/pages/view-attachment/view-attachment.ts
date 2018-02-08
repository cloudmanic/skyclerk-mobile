import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { OverviewPage } from '../overview/overview';

@IonicPage()
@Component({
  selector: 'page-view-attachment',
  templateUrl: 'view-attachment.html',
})
export class ViewAttachmentPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
openOverviewPage(){
  this.navCtrl.push(OverviewPage)
}
  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewAttachmentPage');
  }

}
