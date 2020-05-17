//
// Date: 2020-05-17
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2020 Cloudmanic Labs, LLC. All rights reserved.
//


import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from './account.service';
import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2/ngx';
import { Platform } from '@ionic/angular';
import { Billing } from '../models/billing.model';

@Injectable({
	providedIn: 'root'
})

export class PurchaseService {
	newPurchase: boolean = false;
	billing: Billing = new Billing();
	monthyPrice: string = "$6.00";
	yearlyPrice: string = "$60.00";
	monthlyProduct: any = {};
	yearlyProduct: any = {};

	//
	// Constructor.
	//
	constructor(
		private router: Router,
		private accountService: AccountService,
		private store: InAppPurchase2,
		private platform: Platform) {
		// Bootstrap this service.
		this.setupInAppPurchase();
	}

	//
	// Mainly used so the IDE is not mad.
	// todo(spicer): I am sure there is a better way.
	//
	ping(): boolean {
		return true;
	}

	//
	// Set new purchase.
	//
	setNewPurchase() {
		this.newPurchase = true;
	}

	//
	// Get monthly price
	//
	getMonthlyPrice(): string {
		return this.monthyPrice;
	}

	//
	// Get yearly price
	//
	getYearlyPrice(): string {
		return this.yearlyPrice;
	}

	//
	// Place the order.
	//
	order(product: string) {
		this.store.order(product);
	}

	//
	// Setup in app purchase stuff.
	//
	setupInAppPurchase() {
		// when ready and on a device run this.
		this.platform.ready().then(async () => {

			if (this.platform.is("hybrid")) {

				// Define our products.
				var products = [
					{
						id: "yearly_60",
						type: this.store.PAID_SUBSCRIPTION,
					},
					{
						id: "monthly_6",
						type: this.store.PAID_SUBSCRIPTION,
					}
				];

				// ---------- Store Callbacks --------- //

				// Call back for when a product is owned.
				var owned = (p) => {
					console.log(`You now own ${p.alias}`);

					// Make sure this is new purchase. If not we do not care.
					if (!this.newPurchase) {
						return;
					}

					// Tell backend server about this.
					let plan = "Yearly";

					if (p.id == "monthly_6") {
						plan = "Monthly";
					}

					this.accountService.appleInAppSubscribe(true, plan).subscribe(() => {

						// Tell home to toast this.
						this.accountService.subscriptionUpgraded.emit(true);

						// Reset new purchase.
						this.newPurchase = false;

						// Redirect to home page.
						this.router.navigate(['/home']);
					});
				}

				// Call back for when the store is ready.
				var ready = () => {
					// Store product data
					this.monthlyProduct = this.store.get("monthly_6");
					this.yearlyProduct = this.store.get("yearly_60");

					// Set pricing
					this.monthyPrice = this.monthlyProduct.price;
					this.yearlyPrice = this.yearlyProduct.price;
				}

				// Call back for errors
				var err = (err) => {
					console.error('Store Error ' + JSON.stringify(err));
				}

				// ---------- End Store Callbacks --------- //

				// More debugging?
				//this.store.verbosity = this.store.DEBUG;

				// Setup validator and account username
				let email = localStorage.getItem('user_email');
				this.store.applicationUsername = email; // Can't use account because you can have many billings for one account.
				this.store.validator = "https://validator.fovea.cc/v1/validate?appName=com.cloudmanic.skyclerk&apiKey=d00707d3-d919-4980-8c1d-fcd8fdffcb3d"

				// Register our products
				this.store.register(products);

				// Setup callbacks.
				this.store.when('subscription')
					.approved(p => p.verify())
					.verified(p => p.finish())
					.owned(owned);

				this.store.error(err);
				this.store.ready(ready);

				// Refresh the status of in-app products
				this.store.refresh();
			}
		});
	}

}

/* End File */
