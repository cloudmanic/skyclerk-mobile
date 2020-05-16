//
// Date: 2019-04-14
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { MeService } from '../services/me.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.page.html'
})

export class LoginPage {
	errMsg: string = "";
	email: string = "";
	password: string = "";

	//
	// Construct.
	//
	constructor(private meService: MeService, private router: Router, private authService: AuthService, public alertController: AlertController) {
		// Clear all local storage
		this.meService.logout();
	}

	//
	// Submit login request
	//
	doLogin() {
		// Make the the HTTP request:
		this.authService.login(this.email, this.password).subscribe(
			// Success - Redirect to dashboard.
			() => {
				// Get the user so we can set the default account id
				this.meService.get().subscribe(res => {
					this.password = "";
					localStorage.setItem('account_id', res.Accounts[0].Id.toString());
					this.router.navigate(['home']);
				});
			},

			// Error
			(err: HttpErrorResponse) => {
				this.doErrorAlert(err.error.error);
			}
		);
	}

	//
	// Show error message if login failed.
	//
	async doErrorAlert(msg: string) {
		const alert = await this.alertController.create({
			header: 'Oops! Login Error',
			subHeader: '',
			message: msg,
			buttons: ['OK']
		});

		await alert.present();
	}
}

/* End File */
