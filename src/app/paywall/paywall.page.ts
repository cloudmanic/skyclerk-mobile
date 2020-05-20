//
// Date: 2020-05-17
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2020 Cloudmanic Labs, LLC. All rights reserved.
//

import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../services/purchase.service';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { Billing } from '../models/billing.model';

@Component({
	selector: 'app-paywall',
	templateUrl: './paywall.page.html',
	styleUrls: ['./paywall.page.scss'],
})
export class PaywallPage implements OnInit {
	showBack: boolean = false;
	billing: Billing = new Billing();
	monthyPrice: string = "Loading...";
	yearlyPrice: string = "Loading...";

	//
	// Constructor.
	//
	constructor(
		private router: Router,
		private accountService: AccountService,
		private purchaseService: PurchaseService) {
		// Set pricing
		this.yearlyPrice = this.purchaseService.getYearlyPrice();
		this.monthyPrice = this.purchaseService.getMonthlyPrice();

		// Refresh billing then setup payment stuff.
		this.refreshBilling();
	}

	//
	// NgInit
	//
	ngOnInit() { }

	//
	// Refresh the billing object.
	//
	refreshBilling() {
		this.accountService.getBilling().subscribe(res => {
			this.billing = res;

			// Do we show a back button?
			if (this.billing.Status == "Trial") {
				this.showBack = true;
			} else {
				this.showBack = false;
			}

			// No subscription yet? Continue. This really should not happen.
			// But we put it here as a check.
			if (this.billing.PaymentProcessor != 'None') {
				this.router.navigate(['/home']);
			} else {
				this.purchaseService.setNewPurchase();
			}
		})
	}

	//
	// Call this if we are doing a monthly upgrade
	//
	monthlyClick() {
		this.purchaseService.order("monthly_6");
	}

	//
	// Call this if we are doing a yearly upgrade
	//
	yearlyClick() {
		this.purchaseService.order("yearly_60");
	}
}

/* End File */
