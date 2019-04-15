//
// Date: 2019-04-14
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { MeService } from '../services/me.service';
import { Me } from '../models/me.model';
import { Router } from '@angular/router';

@Component({
	selector: 'app-ledgers',
	templateUrl: './ledgers.page.html'
})

export class LedgersPage implements OnInit {
	me: Me;
	tabs: string = "ledgers";

	//
	// Constructor.
	//
	constructor(private router: Router, private alertController: AlertController, private meService: MeService) { }

	//
	// NgInit
	//
	ngOnInit() {
		this.loadMe();
	}

	//
	// Load the data for logged in user.
	//
	loadMe() {
		this.meService.get().subscribe(res => {
			// Set me data.
			this.me = res;

			// If account_is is not set we need to set it.
			if (!localStorage.getItem('account_id')) {
				this.doAccountSwitch(this.me.Accounts[0].Id);
			} else {
				// Load page data.
				this.loadPageData();
			}
		});
	}

	//
	// Load data for page.
	//
	loadPageData() {
		console.log("loading page data..." + localStorage.getItem('account_id'));
	}

	//
	// Do Logout
	//
	doLogout() {
		this.meService.logout();
		this.router.navigate(['intro']);
	}

	//
	// Switch account.
	//
	doAccountSwitch(accountId: number) {
		// Set the new account id in the localStorage
		localStorage.setItem('account_id', accountId.toString());

		// Load page data.
		this.loadPageData();
	}

	//
	// doAccounts - Show the accounts selector.
	//
	async doAccounts() {
		// Build inputs
		let inputs = []

		for (let i = 0; i < this.me.Accounts.length; i++) {
			let row = this.me.Accounts[i];

			inputs.push({
				name: 'radio' + i,
				type: 'radio',
				label: row.Name,
				value: row.Id,
				checked: false
			});

			inputs[0].checked = true;
		}

		// Show the alert.
		const alert = await this.alertController.create({
			header: 'Your Accounts',
			inputs: inputs,
			buttons: [
				{
					text: 'Switch Account',
					handler: (accountId) => {
						this.doAccountSwitch(accountId);
					}
				}
			]
		});

		await alert.present();
	}
}

/* End File */
