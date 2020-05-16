import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2/ngx';
import { Platform, LoadingController } from '@ionic/angular';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-paywall',
	templateUrl: './paywall.page.html',
	styleUrls: ['./paywall.page.scss'],
})
export class PaywallPage implements OnInit {
	monthyPrice: string = "Loading...";
	yearlyPrice: string = "Loading...";
	monthlyProduct: any = {};
	yearlyProduct: any = {};

	//
	// Constructor.
	//
	constructor(private accountService: AccountService, private platform: Platform, private store: InAppPurchase2, private cRef: ChangeDetectorRef, private router: Router, private loadingController: LoadingController) {
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
		this.platform.ready().then(async () => {

			if (this.platform.is("hybrid")) {

				// Show Loader spinner.
				const loading = await this.loadingController.create({
					spinner: "bubbles",
					message: 'Loading Plans...',
				});
				loading.present();

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

				let email = localStorage.getItem('user_email');
				let accountId = localStorage.getItem('account_id');
				this.store.applicationUsername = email; // Can't use account because you can have many billings for one account.
				this.store.validator = "https://validator.fovea.cc/v1/validate?appName=com.cloudmanic.skyclerk&apiKey=d00707d3-d919-4980-8c1d-fcd8fdffcb3d"

				this.store.when('subscription')
					.approved(p => p.verify())
					.verified(p => p.finish())
					.owned(p => {
						console.log(`You now own ${p.alias}`);

						// Tell backend server about this.
						let plan = "Yearly";

						if (p.id == "monthly_6") {
							plan = "Monthly";
						}

						this.accountService.appleInAppSubscribe(true, plan).subscribe(() => {
							this.router.navigate(['/home']);
						});
					});

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
					loading.dismiss();
				});

				// Refresh the status of in-app products
				this.store.refresh();
			}
		});
	}
}

/* End File */
