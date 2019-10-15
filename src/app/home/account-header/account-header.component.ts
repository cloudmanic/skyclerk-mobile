//
// Date: 2019-04-16
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Me } from 'src/app/models/me.model';
import { AlertController } from '@ionic/angular';
import { Account } from 'src/app/models/account.model';

@Component({
	selector: 'app-home-account-header',
	templateUrl: './account-header.component.html'
})

export class AccountHeaderComponent implements OnInit {
	@Input() me: Me = new Me();
	@Input() account: Account = new Account();
	@Output() toggleHeader: EventEmitter<string> = new EventEmitter<string>();
	@Output() accountChange: EventEmitter<number> = new EventEmitter<number>();

	dblTapDoAccountCount: number = 0;

	//
	// Constructor
	//
	constructor(private alertController: AlertController) { }

	//
	// NgInit
	//
	ngOnInit() { }

	//
	// Double tap to trigger do accounts.
	//
	dblTapHeader() {
		this.doTableHeaderClick();

		// this.dblTapDoAccountCount++;
		//
		// setTimeout(() => {
		// 	if (this.dblTapDoAccountCount == 1) {
		// 		this.dblTapDoAccountCount = 0;
		// 		this.doTableHeaderClick();
		// 	} if (this.dblTapDoAccountCount > 1) {
		// 		this.dblTapDoAccountCount = 0;
		//
		// 		// No need to do this if we only have one account.
		// 		if (this.me.Accounts.length > 1) {
		// 			this.doAccounts();
		// 		}
		// 	}
		// }, 250);
	}

	//
	// Click the header of the table.
	//
	doTableHeaderClick() {
		this.toggleHeader.emit('cols');
	}

	//
	// Switch account.
	//
	doAccountSwitch(accountId: number) {
		// Set the new account id in the localStorage
		localStorage.setItem('account_id', accountId.toString());

		// Send the account change notice back to the parent.
		this.accountChange.emit(accountId);
	}

	//
	// doAccounts - Show the accounts selector.
	//
	async doAccounts() {
		// Build inputs
		let inputs = []

		// Get current account.
		let current = Number(localStorage.getItem('account_id'));

		for (let i = 0; i < this.me.Accounts.length; i++) {
			let row = this.me.Accounts[i];

			// Set active account.
			let checked = false;
			if (current == row.Id) {
				checked = true;
			}

			inputs.push({
				name: 'radio' + i,
				type: 'radio',
				label: row.Name,
				value: row.Id,
				checked: checked
			});
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
