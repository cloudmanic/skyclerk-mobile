import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2/ngx';
import { Platform } from '@ionic/angular';

@Component({
	selector: 'app-paywall',
	templateUrl: './paywall.page.html',
	styleUrls: ['./paywall.page.scss'],
})
export class PaywallPage implements OnInit {
	monthyPrice: string = "";
	yearlyPrice: string = "";
	monthlyProduct: any = {};
	yearlyProduct: any = {};

	//
	// Constructor.
	//
	constructor(private platform: Platform, private store: InAppPurchase2, private cRef: ChangeDetectorRef) {
		// Load payment stuff.
		this.setupInAppPurchase();
	}

	//
	// NgInit
	//
	ngOnInit() { }

	//
	// Call this if we are doing a monthly upgrade
	//
	monthlyClick() {
		this.store.order("monthly_6");
	}

	//
	// Call this if we are doing a yearly upgrade
	//
	yearlyClick() {
		this.store.order("yearly_60");
	}

	//
	// Setup in app purchase stuff.
	//
	setupInAppPurchase() {
		// when ready and on a device run this.
		this.platform.ready().then(() => {
			if (this.platform.is("hybrid")) {
				// More debugging?
				//this.store.verbosity = this.store.DEBUG;

				// Register our products
				this.store.register({
					id: "yearly_60",
					type: this.store.PAID_SUBSCRIPTION,
				});

				this.store.register({
					id: "monthly_6",
					type: this.store.PAID_SUBSCRIPTION,
				});

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


				// Call this after purchase has been approved.
				this.store.when("yearly_60").approved((product: IAPProduct) => {
					console.log("Tell backend server about this. (yearly_60)");
					product.finish();
				});

				this.store.when("monthly_6").approved((product: IAPProduct) => {
					console.log("Tell backend server about this. (monthly_6)");
					product.finish();
				});

				// // User closed the native purchase dialog
				// this.store.when("yearly_60").cancelled((product) => {
				// 	console.error('Purchase was Cancelled (yearly_60)');
				// });
				//
				// this.store.when("monthly_6").cancelled((product) => {
				// 	console.error('Purchase was Cancelled (monthly_6)');
				// });

				// Track all store errors
				this.store.error((err) => {
					console.error('Store Error ' + JSON.stringify(err));
				});


				// Run some code only when the store is ready to be used
				this.store.ready(() => {
					// Store product data
					this.monthlyProduct = this.store.get("monthly_6");
					this.yearlyProduct = this.store.get("yearly_60");

					// Set pricing
					this.monthyPrice = this.monthlyProduct.price;
					this.yearlyPrice = this.yearlyProduct.price;
					this.cRef.detectChanges();
				});

				// Refresh the status of in-app products
				this.store.refresh();
			}
		});
	}

}

/* End File */
