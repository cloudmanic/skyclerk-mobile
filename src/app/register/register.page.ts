//
// Date: 2019-10-16
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import { Component } from '@angular/core';
import { MeService } from '../services/me.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-register',
	templateUrl: './register.page.html'
})

export class RegisterPage {
	errMsg: string = "";
	name: string = "";
	email: string = "";
	password: string = "";
	confirm: string = "";

	//
	// Construct.
	//
	constructor(private meService: MeService, private router: Router, private authService: AuthService, public alertController: AlertController) {
		// Clear all local storage
		this.meService.logout();
	}

	//
	// Submit register request
	//
	doRegister() {
		// Validate name
		if (!this.name.length) {
			this.doErrorAlert("Please provide a name.");
			return;
		}

		// Validate email
		if (!this.email.length) {
			this.doErrorAlert("Please provide an email.");
			return;
		}

		// Validate passwords match.
		if (this.password != this.confirm) {
			this.doErrorAlert("Your passwords do not match.");
			return;
		}

		// Make the the HTTP request:
		this.authService.register(this.email, this.password, this.name).subscribe(
			// Success - Redirect to dashboard.
			() => {
				this.router.navigate(['home']);
			},

			// Error
			(err: HttpErrorResponse) => {
				this.doErrorAlert(err.error.error);
			}
		);
	}

	//
	// Show error message if register failed.
	//
	async doErrorAlert(msg: string) {
		const alert = await this.alertController.create({
			header: 'Oops! Register Error',
			subHeader: '',
			message: msg,
			buttons: ['OK']
		});

		await alert.present();
	}
}

/* End File */
