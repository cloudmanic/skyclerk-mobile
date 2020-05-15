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
import { ToastController, IonContent, Platform } from '@ionic/angular';
import { ReportService, PnlCurrentYear } from '../services/report.service';
import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2/ngx';

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
	ledgersType: string = "";
	ledgersSearch: string = "";
	ledgersSearchTerm: string = ""; // Used before we hit the search button.
	snapClerkPage: number = 1;
	snapClerkLastPage: boolean = false;
	ledgers: Ledger[] = [];
	snapclerks: SnapClerk[] = [];
	account: Account = new Account();
	activeTableHeader: string = "";
	dblTapFooterLogoCount: number = 0;
	pnl: PnlCurrentYear = { Year: 0, Value: 0 };

	@ViewChild(IonContent) content: IonContent;
	@ViewChild(AccountHeaderComponent) accountHeaderComponent;

	//
	// Constructor.
	//
	constructor(
		private platform: Platform,
		private store: InAppPurchase2,
		private toastController: ToastController,
		private meService: MeService,
		private ledgerService: LedgerService,
		private snapClerkService: SnapClerkService,
		private reportService: ReportService) { }

	//
	// NgInit
	//
	ngOnInit() {
		// Load me.
		this.loadMe();

		// Setup inapp pruchases.
		this.setupInAppPurchase();

		// Listen for ledger entry delete.
		this.ledgerService.deleted.subscribe(() => {
			this.ledgersPage = 1;
			this.ledgersType = "";
			this.ledgersSearch = "";
			this.loadMe();
			this.presentLedgerToastDeleted();
		});

		// Listen for ledger change requests.
		this.ledgerService.refresh.subscribe(() => {
			this.ledgersPage = 1;
			this.ledgersType = "";
			this.ledgersSearch = "";
			this.loadMe();
			this.presentLedgerToast();
		});

		// Listen for receipt uploads from snapclerk
		this.snapClerkService.upload.subscribe(data => {
			this.uploadSnapClerkData(data);
		});

		// If app sleeps reload data on start.
		App.addListener('appStateChange', (state) => {
			// Open app
			if (state.isActive) {
				this.loadMe();
			}
		});
	}

	//
	// Load data for page.
	//
	loadPageData() {
		this.getPnL();
		this.loadLedgerData();
		this.loadSnapClerkData();
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
	// Load more Snap!Clerks
	//
	loadMoreSnapClerks() {
		this.snapClerkPage++;
		this.loadSnapClerkData();
	}

	//
	// Load Ledger data
	//
	loadLedgerData() {
		this.ledgerService.get(this.ledgersPage, this.ledgersType, this.ledgersSearch).subscribe(res => {
			// This is a hack because we typically append instead of showing a new page.
			if (this.ledgersPage <= 1) {
				this.ledgers = res.Data;
				this.content.scrollToTop(1500); // TODO(spicer): Does not seem to work as we would expect
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
		// No need to do this if we only have one account.
		if (this.me.Accounts.length > 1) {
			this.accountHeaderComponent.doAccounts();
		}

		// this.dblTapFooterLogoCount++;
		//
		// setTimeout(() => {
		// 	if (this.dblTapFooterLogoCount == 1) {
		// 		this.dblTapFooterLogoCount = 0;
		// 	} if (this.dblTapFooterLogoCount > 1) {
		// 		this.dblTapFooterLogoCount = 0;
		//
		// 		// No need to do this if we only have one account.
		// 		if (this.me.Accounts.length > 1) {
		// 			this.accountHeaderComponent.doAccounts();
		// 		}
		// 	}
		// }, 250);
	}

	//
	// Do account change.
	//
	doAccountChange(accountId: number) {
		// Set the active account.
		this.setActiveAccount(accountId);

		// Reset ledger page count.
		this.ledgersPage = 1;

		// Reset snapClerkPage page count.
		this.snapClerkPage = 1;

		// Load page data.
		this.loadPageData();
	}

	//
	// When Ledger table header click
	//
	doLegerTableHeaderChange(show: string) {
		this.activeTableHeader = show;
	}

	//
	// doLedgerType click
	//
	doLedgerType(type: string) {
		this.ledgersPage = 1;
		this.ledgersType = type;
		this.tabs = "ledger";
		this.loadPageData();
	}

	//
	// Run a search query on the ledger
	//
	doLedgerSearch() {
		this.ledgersSearch = this.ledgersSearchTerm;
		this.ledgersPage = 1;
		this.ledgersType = "";
		this.loadPageData();
	}

	//
	// Reset the ledger back to orginal state.
	//
	doLedgerTabClick() {
		this.ledgersSearch = "";
		this.ledgersSearchTerm = ""
		this.ledgersPage = 1;
		this.ledgersType = "";
		this.loadPageData();
	}

	//
	// Refresh data
	//
	doRefresh(event) {
		this.loadPageData();
		this.loadSnapClerkData();

		setTimeout(() => {
			event.target.complete();
		}, 2000);
	}

	//
	// Get the Year PNL
	//
	getPnL() {
		this.reportService.getPnlCurrentYear().subscribe(res => {
			this.pnl = res;
		});
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
		this.snapclerks.unshift(sc);

		// Show uploading toast.
		this.presentSnapClerkUploadingToast();

		// Wrap this upload in a background function so it continues after closing the app.
		// We really do not need this as the upload stuff runs in the background but
		// if we do not do this for some reason the UI locks up.
		let taskId = BackgroundTask.beforeExit(async () => {
			try {
				// Upload via the Snap!Clerk service.
				await this.snapClerkService.create(data.photo, data.type, data.note, data.labels, data.category, data.lat, data.lon);
			} catch (e) {
				console.log(e);
			}

			// Reload snapclerk data.
			this.loadSnapClerkData();

			// Kill background task
			BackgroundTask.finish({ taskId });
		});
	}

	//
	// Present Snap!Clerk uploading toast.
	//
	async presentSnapClerkUploadingToast() {
		const toast = await this.toastController.create({
			position: 'top',
			message: 'Uploading receipt... (You can close the app)',
			duration: 3000
		});

		toast.present();
	}

	//
	// Present ledger complete..
	//
	async presentLedgerToast() {
		const toast = await this.toastController.create({
			position: 'top',
			message: 'Your ledger entry has been saved.',
			duration: 2000
		});

		toast.present();
	}

	//
	// Present ledger delete complete..
	//
	async presentLedgerToastDeleted() {
		const toast = await this.toastController.create({
			position: 'top',
			message: 'Your ledger entry has been deleted.',
			duration: 2000
		});

		toast.present();
	}


	// ---------------- Purchase Stuff  ----------------- //

	//
	// Setup in app purchase stuff.
	//
	setupInAppPurchase() {
		// when ready and on a device run this.
		this.platform.ready().then((r) => {
			if (this.platform.is("hybrid")) {


				// After platform ready
				//this.store.verbosity = this.store.DEBUG;

				// this.store.register({
				// 	id: "yearly_60",
				// 	type: this.store.PAID_SUBSCRIPTION,
				// });
				//
				// this.store.register({
				// 	id: "monthly_6",
				// 	type: this.store.PAID_SUBSCRIPTION,
				// });
				//
				// // Updated
				// this.store.when("yearly_60").updated((product: IAPProduct) => {
				// 	//console.log('Updated' + JSON.stringify(product));
				// 	console.log("owned (yearly_60): " + product.owned);
				// });
				//
				// this.store.when("monthly_6").updated((product: IAPProduct) => {
				// 	//console.log('Updated' + JSON.stringify(product));
				// 	console.log("owned (monthly_6): " + product.owned);
				// });
				//
				//
				// // Call this after purchase has been approved.
				// this.store.when("yearly_60").approved((product: IAPProduct) => {
				// 	console.log("Tell backend server about this. (yearly_60)");
				// 	product.finish();
				// });
				//
				// this.store.when("monthly_6").approved((product: IAPProduct) => {
				// 	console.log("Tell backend server about this. (monthly_6)");
				// 	product.finish();
				// });
				//
				// // User closed the native purchase dialog
				// this.store.when("yearly_60").cancelled((product) => {
				// 	console.error('Purchase was Cancelled (yearly_60)');
				// });
				//
				// this.store.when("monthly_6").cancelled((product) => {
				// 	console.error('Purchase was Cancelled (monthly_6)');
				// });
				//
				// // Track all store errors
				// this.store.error((err) => {
				// 	console.error('Store Error ' + JSON.stringify(err));
				// });
				//
				// // Run some code only when the store is ready to be used
				// this.store.ready(() => {
				// 	console.log('Store is ready');
				// 	//console.log('Products: ' + JSON.stringify(this.store.products));
				// 	//console.log(JSON.stringify(this.store.get("yearly_60")));
				// 	//console.log(JSON.stringify(this.store.get("yearly_6")));
				// });
				//
				//
				// // Refresh the status of in-app products
				// this.store.refresh();
				//
				//
				// // To make a purchase
				// this.store.order("monthly_6");

			}
		});
	}

}


/* End File */
