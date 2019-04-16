//
// Date: 2019-04-14
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { MeService } from '../services/me.service';
import { Me } from '../models/me.model';
import { Router } from '@angular/router';
import { Account } from '../models/account.model';
import { LedgerService } from '../services/ledger.service';
import { Ledger } from '../models/ledger.model';
import { SettingsComponent } from '../settings/settings.component';
import { SelectAnAccountPage } from '../select-an-account/select-an-account.page';

@Component({
	selector: 'app-home',
	templateUrl: './home.page.html'
})

export class HomePage implements OnInit {
	me: Me;
	tabs: string = "ledger";
	ledgers: Ledger[] = [];
	account: Account = new Account();
	activeTableHeader: string = "";
	dblTapDoAccountCount: number = 0;
	dblTapLedgerHeaderCount: number = 0;

	receipts = [
		{ img: "thumb-01.png", dm: "May 13", year: "2018", title: "Chevron", cate: "Gas" },
		{ img: "thumb-02.png", dm: "May 06", year: "2018", title: "Rivers Run", cate: "Gas" },
		{ img: "thumb-03.png", dm: "May 04", year: "2018", title: "Flying J", cate: "Gas" },
		{ img: "thumb-04.png", dm: "Apr 21", year: "2018", title: "Fred Meyer Fue", cate: "Gas" },
		{ img: "thumb-05.png", dm: "Apr 21", year: "2018", title: "Chevron", cate: "Gas" },
		{ img: "thumb-06.png", dm: "May 13", year: "2018", title: "Chevron", cate: "Gas" },
		{ img: "thumb-01.png", dm: "May 13", year: "2018", title: "Chevron", cate: "Gas" },
		{ img: "thumb-02.png", dm: "May 13", year: "2018", title: "Chevron", cate: "Gas" },
		{ img: "thumb-03.png", dm: "May 13", year: "2018", title: "Chevron", cate: "Gas" },
	]

	//
	// Constructor.
	//
	constructor(private router: Router, private alertController: AlertController, private modalController: ModalController, private meService: MeService, private ledgerService: LedgerService) { }

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

			// Set if we have more than one account or not
			if (this.me.Accounts.length > 1) {
				this.activeTableHeader = "account";
			} else {
				this.activeTableHeader = "cols";
			}

			// Set get the active account from local storeage
			let accountId = localStorage.getItem('account_id');

			// If account_is is not set we need to set it.
			if (!accountId) {
				this.doAccountSwitch(this.me.Accounts[0].Id);
			} else {
				// Set the active account.
				this.setActiveAccount(Number(accountId));

				// Load page data.
				this.loadPageData();
			}
		});
	}

	//
	// Load data for page.
	//
	loadPageData() {
		this.loadLedgerData();
	}

	//
	// Load Ledger data
	//
	loadLedgerData() {
		this.ledgerService.get().subscribe(res => {
			this.ledgers = res;
		});
	}

	//
	// Do settings
	//
	async doSettings() {
		// Create a modal using MyModalComponent with some initial data
		const modal = await this.modalController.create({
			component: SelectAnAccountPage,
			componentProps: {
				'prop1': "ff",
				'prop2': "fff333"
			}
		});

		return await modal.present();
	}

	//
	// Switch account.
	//
	doAccountSwitch(accountId: number) {
		// Set the new account id in the localStorage
		localStorage.setItem('account_id', accountId.toString());

		// Set the active account.
		this.setActiveAccount(accountId);

		// Load page data.
		this.loadPageData();
	}

	//
	// Double tap ledger header
	//
	dblTapLedgerHeader() {
		this.dblTapLedgerHeaderCount++;

		setTimeout(() => {
			if (this.dblTapLedgerHeaderCount == 1) {
				this.dblTapLedgerHeaderCount = 0;

				// Switch to the table columns.
				this.activeTableHeader = "cols";
			} if (this.dblTapLedgerHeaderCount > 1) {
				this.dblTapLedgerHeaderCount = 0;

				// Show the accounts selectors
				this.doAccounts();
			}
		}, 250);
	}

	//
	// Double tap to trigger do accounts.
	//
	dblTapDoAccount() {
		this.dblTapDoAccountCount++;

		setTimeout(() => {
			if (this.dblTapDoAccountCount == 1) {
				this.dblTapDoAccountCount = 0;
			} if (this.dblTapDoAccountCount > 1) {
				this.dblTapDoAccountCount = 0;
				this.doAccounts();
			}
		}, 250);
	}

	//
	// Set active account
	//
	setActiveAccount(accountId: number) {
		// Set the account
		for (let i = 0; i < this.me.Accounts.length; i++) {
			if (this.me.Accounts[i].Id == accountId) {
				this.account = this.me.Accounts[i];
			}
		}
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
