//
// Date: 2019-04-14
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import { Component, OnInit, ViewChild } from '@angular/core';
import { MeService } from '../services/me.service';
import { Me } from '../models/me.model';
import { Account } from '../models/account.model';
import { LedgerService } from '../services/ledger.service';
import { AccountHeaderComponent } from './account-header/account-header.component';
import { Ledger } from '../models/ledger.model';
import { SnapClerkService, SnapClerkUploadRequest } from '../services/snapckerk.service';
import { SnapClerk } from '../models/snapclerk.model';
import { File as FileModel } from '../models/file.model';
import { Plugins } from '@capacitor/core';

const { App, BackgroundTask } = Plugins;

@Component({
	selector: 'app-home',
	templateUrl: './home.page.html'
})

export class HomePage implements OnInit {
	me: Me;
	taskId: any;
	tabs: string = "ledger";
	ledgerLastPage: boolean = false;
	ledgersPage: number = 1;
	snapClerkPage: number = 1;
	snapClerkLastPage: boolean = false;
	ledgers: Ledger[] = [];
	snapclerks: SnapClerk[] = [];
	account: Account = new Account();
	activeTableHeader: string = "";
	dblTapFooterLogoCount: number = 0;

	@ViewChild(AccountHeaderComponent) accountHeaderComponent;

	//
	// Constructor.
	//
	constructor(private meService: MeService, private ledgerService: LedgerService, private snapClerkService: SnapClerkService) { }

	//
	// NgInit
	//
	ngOnInit() {
		this.loadMe();

		// Listen for receipt uploads from snapclerk
		this.snapClerkService.upload.subscribe(data => {
			this.uploadSnapClerkData(data);
		});

		// If app sleeps reload data on start.
		App.addListener('appStateChange', (state) => {
			if (state.isActive) {
				this.loadMe();
			}
		});
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
				this.doAccountChange(this.me.Accounts[0].Id);
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
		this.loadSnapClerkData();
	}

	//
	// Load SnapClerk data
	//
	loadSnapClerkData() {
		this.snapClerkService.get(this.snapClerkPage, "SnapClerkId", "desc").subscribe(res => {
			// This is a hack because we typically append instead of showing a new page.
			if (this.snapClerkPage <= 1) {
				this.snapclerks = res.Data;
			} else {
				for (let i = 0; i < res.Data.length; i++) {
					this.snapclerks.push(res.Data[i]);
				}
			}

			// Update last page flag.
			this.snapClerkLastPage = res.LastPage;
		});
	}

	//
	// Load Ledger data
	//
	loadLedgerData() {
		this.ledgerService.get(this.ledgersPage).subscribe(res => {
			// This is a hack because we typically append instead of showing a new page.
			if (this.ledgersPage <= 1) {
				this.ledgers = res.Data;
			} else {
				for (let i = 0; i < res.Data.length; i++) {
					this.ledgers.push(res.Data[i]);
				}
			}

			// Update last page flag.
			this.ledgerLastPage = res.LastPage;
		});
	}

	//
	// Load more ledger items
	//
	loadMoreLedgers() {
		this.ledgersPage++;
		this.loadLedgerData();
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
	// Do footer logo click
	//
	doFooterLogoClick() {
		this.dblTapFooterLogoCount++;

		setTimeout(() => {
			if (this.dblTapFooterLogoCount == 1) {
				this.dblTapFooterLogoCount = 0;
			} if (this.dblTapFooterLogoCount > 1) {
				this.dblTapFooterLogoCount = 0;

				// No need to do this if we only have one account.
				if (this.me.Accounts.length > 1) {
					this.accountHeaderComponent.doAccounts();
				}
			}
		}, 250);
	}

	//
	// Do account change.
	//
	doAccountChange(accountId: number) {
		// Set the active account.
		this.setActiveAccount(accountId);

		// Reset ledger page count.
		this.ledgersPage = 1;

		// Load page data.
		this.loadPageData();
	}

	//
	// When Ledger table header click
	//
	doLegerTableHeaderChange(show: string) {
		this.activeTableHeader = show;
	}

	// -------------- SnapClerk Upload Stuff ----------- //

	//
	// uploadSnapClerkData - Upload image to server.
	//
	async uploadSnapClerkData(data: SnapClerkUploadRequest) {
		// Reset page.
		this.snapClerkPage = 0;

		// Push this photo on the front of the array to view.
		let sc = new SnapClerk();
		sc.Contact = "Uploading...";
		sc.Status = "Pending";
		sc.Category = data.category;
		sc.CreatedAt = new Date();
		sc.File = new FileModel;
		sc.File.Thumb600By600Url = data.photoWeb;
		this.snapclerks.unshift(sc)

		// Startup load to server
		const imgBlob = FileModel.b64toBlob(data.photo, data.type);

		// Build form data.
		const formData = new FormData();
		formData.append('file', imgBlob, this.createFileName(data.type));
		formData.append('note', data.note);
		formData.append('labels', data.labels);
		formData.append('category', data.category);

		// // In this function We might finish the upload
		// let taskId = BackgroundTask.beforeExit(async () => {
		// 	// Log
		// 	console.log("Starting upload of snapclerk receipt.");
		//
		// 	// Post file to server
		// 	this.snapClerkService.create(formData).subscribe(
		// 		res => {
		// 			// Reload snapclerk data.
		// 			this.loadSnapClerkData();
		//
		// 			// Log
		// 			console.log("Done uploading snapclerk receipt.");
		//
		// 			console.log(res);
		// 			BackgroundTask.finish({ taskId });
		// 		},
		//
		// 		error => {
		// 			// Show error in an alert
		// 			console.log(error);
		//
		// 			BackgroundTask.finish({ taskId });
		// 		}
		// 	);
		// });

		// Log
		console.log("Starting upload of snapclerk receipt.");

		// Post file to server
		this.snapClerkService.create(formData).subscribe(
			() => {
				// Reload snapclerk data.
				this.loadSnapClerkData();
				// Log
				console.log("Done uploading snapclerk receipt.");
			},

			error => {
				// Show error in an alert
				console.log(error);
			}
		);
	}

	//
	// Create a file name for this upload.
	//
	createFileName(type: string) {
		let d = new Date();
		let n = d.getTime();
		return "sc-mobile-" + n + "." + type.split("/")[1];
	}
}


/* End File */
