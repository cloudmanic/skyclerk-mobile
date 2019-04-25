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
import { SnapClerkService } from '../services/snapckerk.service';
import { SnapClerk } from '../models/snapclerk.model';

@Component({
	selector: 'app-home',
	templateUrl: './home.page.html'
})

export class HomePage implements OnInit {
	me: Me;
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
	constructor(private meService: MeService, private ledgerService: LedgerService, private snapClerkService: SnapClerkService) { }

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
}


/* End File */
