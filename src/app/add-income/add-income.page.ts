import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-income',
  templateUrl: './add-income.page.html',
  styleUrls: ['./add-income.page.scss'],
})
export class AddIncomePage implements OnInit {

  constructor(public modalController:ModalController) { }

  dismiss(){
    this.modalController.dismiss();
  }

  ngOnInit() {
  }

}
