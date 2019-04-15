//
// Date: 2019-04-14
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
	selector: 'app-ledgers',
	templateUrl: './ledgers.page.html'
})

export class LedgersPage implements OnInit {
	tabs: string = "ledgers";

	//
	// Constructor.
	//
	constructor(private alertController: AlertController) { }

	ngOnInit() {
	}

	//
	// doAccounts - Show the accounts selector.
	//
	async doAccounts() {
		const alert = await this.alertController.create({
			header: 'Radio',
			inputs: [
				{
					name: 'radio1',
					type: 'radio',
					label: 'Radio 1',
					value: 'value1',
					checked: true
				},
				{
					name: 'radio2',
					type: 'radio',
					label: 'Radio 2',
					value: 'value2'
				},
				{
					name: 'radio3',
					type: 'radio',
					label: 'Radio 3',
					value: 'value3'
				},
				{
					name: 'radio4',
					type: 'radio',
					label: 'Radio 4',
					value: 'value4'
				},
				{
					name: 'radio5',
					type: 'radio',
					label: 'Radio 5',
					value: 'value5'
				},
				{
					name: 'radio6',
					type: 'radio',
					label: 'Radio 6 Radio 6 Radio 6 Radio 6 Radio 6 Radio 6 Radio 6 Radio 6 Radio 6 Radio 6 ',
					value: 'value6'
				}
			],
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					cssClass: 'secondary',
					handler: () => {
						console.log('Confirm Cancel');
					}
				}, {
					text: 'Ok',
					handler: () => {
						console.log('Confirm Ok');
					}
				}
			]
		});

		await alert.present();
	}
}

/* End File */
