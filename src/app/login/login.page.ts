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
	constructor(private router: Router, private authService: AuthService, public alertController: AlertController) {
		// Clear all local storage
		localStorage.removeItem('user_id');
		localStorage.removeItem('account_id');
		localStorage.removeItem('access_token');
	}

	//
	// Submit login request
	//
	doLogin() {
		// Make the the HTTP request:
		this.authService.login(this.email, this.password).subscribe(
			// Success - Redirect to dashboard.
			() => {
				this.router.navigate(['ledgers']);
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
			header: 'Opps! Login Error',
			subHeader: '',
			message: msg,
			buttons: ['OK']
		});

		await alert.present();
	}

}

/* End File */
