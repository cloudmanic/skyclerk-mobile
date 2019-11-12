//
// Date: 2019-11-11
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import { Component, OnInit } from '@angular/core';
import { Ledger } from 'src/app/models/ledger.model';
import { ActivatedRoute } from '@angular/router';
import { LedgerService } from '../services/ledger.service';
import { NavController, AlertController } from '@ionic/angular';

@Component({
	selector: 'app-ledger-view',
	templateUrl: './ledger-view.page.html'
})

export class LedgerViewPage implements OnInit {
	ledger: Ledger = new Ledger();

	//
	// Construct.
	//
	constructor(
		public route: ActivatedRoute,
		public alertController: AlertController,
		public ledgerService: LedgerService,
		public navCtrl: NavController) { }

	//
	// Refresh the me object.
	//
	ngOnInit() {
		// Is this an edit action?
		let ledgerId = this.route.snapshot.params['id'];

		// Get the ledger based on the id we passed in.
		this.loadLedgerEntry(ledgerId);
	}

	//
	// Load Ledger entry.
	//
	loadLedgerEntry(ledgerId: number) {
		this.ledgerService.getById(ledgerId).subscribe(res => {
			this.ledger = res;
		});
	}

	//
	// Are you sure you want to delete account.
	//
	async deleteLedger() {
		const alert = await this.alertController.create({
			header: 'Delete Ledger Entry',
			subHeader: '',
			message: 'Are you sure you want to delete this ledger entry?',
			buttons: [
				{
					text: 'No, just joking.',
					role: 'cancel',
					cssClass: 'secondary'
				},
				{
					text: 'Yes, I am sure.',
					handler: () => {
						// Delete ledger entry in BE.
						this.ledgerService.delete(this.ledger).subscribe(
							// Success
							() => {
								this.ledgerService.deleted.emit(true);
								this.navCtrl.back();
							},

							// Error
							err => {
								this.doAlert("Oops!", err.error.error);
							}
						);
					}
				}
			]
		});

		await alert.present();
	}

	//
	// Show alert message if actions failed.
	//
	async doAlert(header: string, msg: string) {
		const alert = await this.alertController.create({
			header: header,
			subHeader: '',
			message: msg,
			buttons: ['OK']
		});

		await alert.present();
	}

}

/* End File */
