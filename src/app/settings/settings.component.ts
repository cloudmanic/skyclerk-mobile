//
// Date: 2019-04-14
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//


import { Component, OnInit } from '@angular/core';
import { MeService } from '../services/me.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular';
import { AccountService } from '../services/account.service';
import { Account } from '../models/account.model';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html'
})

export class SettingsComponent implements OnInit {
	account: Account = new Account();
	version: string = environment.version;

	//
	// Construct.
	//
	constructor(private router: Router, private meService: MeService, private alertController: AlertController, private accountService: AccountService) { }

	//
	// NgInit
	//
	ngOnInit() {
		// Load page data.
		this.refreshAccount();
	}

	//
	// Refresh the account object.
	//
	refreshAccount() {
		this.accountService.getAccount().subscribe(res => {
			this.account = res;
		})
	}

	//
	// Change user profile.
	//
	async doUserProfilePrompt() {
		const alert = await this.alertController.create({
			header: 'User Profile',
			inputs: [
				{
					name: 'FirstName',
					type: 'text',
					placeholder: 'First Name',
					value: ''
				},
				{
					name: 'LastName',
					type: 'text',
					placeholder: 'Last Name',
					value: ''
				},
				{
					name: 'Email',
					type: 'email',
					placeholder: 'Email',
					value: ''
				},
			],
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					cssClass: 'secondary',
					handler: () => {
						console.log('Confirm Cancel');
					}
				}, {
					text: 'Update',
					handler: () => {
						console.log('Confirm Ok');
					}
				}
			]
		});

		await alert.present();
	}

	//
	// Change account name
	//
	async doAccountNamePrompt() {
		const alert = await this.alertController.create({
			header: 'Account Name',
			inputs: [
				{
					name: 'AccountName',
					type: 'text',
					placeholder: 'Account Name',
					value: this.account.Name
				}
			],
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					cssClass: 'secondary',
					handler: () => {
						//console.log('Confirm Cancel');
					}
				}, {
					text: 'Update',
					handler: (field) => {
						// Validate
						if (!field.AccountName.length) {
							this.doAlert("Oops!", "Please fill out all fields.");
							return
						}

						// Add new name to object.
						this.account.Name = field.AccountName;

						// Update account information in the backend
						this.accountService.update(this.account).subscribe(
							// Success
							() => {
								this.doAlert("Success!", "Your account name has been updated.");
							},

							// Error
							err => {
								this.doAlert("Oops!", err.error.error);
							}
						);
					}
				}
			]
		});

		await alert.present();
	}

	//
	// Change password
	//
	async doChangePasswordPrompt() {
		const alert = await this.alertController.create({
			header: 'Change Password',
			inputs: [
				{
					name: 'Current',
					type: 'password',
					placeholder: 'Current Password',
					value: ''
				},
				{
					name: 'Password',
					type: 'password',
					placeholder: 'Password',
					value: ''
				},
				{
					name: 'PasswordConfirm',
					type: 'password',
					placeholder: 'Password Confirm',
					value: ''
				}
			],
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					cssClass: 'secondary',
					handler: () => {
						//console.log('Confirm Cancel');
					}
				}, {
					text: 'Update',
					handler: (fields) => {
						// Validate password
						if ((!fields.Password.length) || (!fields.PasswordConfirm.length) || (!fields.Current.length)) {
							this.doAlert("Oops!", "Please fill out all fields.");
							return;
						}

						// Validate password
						if (fields.Password != fields.PasswordConfirm) {
							this.doAlert("Oops!", "Passwords did not match.");
							return;
						}

						// Update password with BE
						this.meService.updatePassword(fields.Current, fields.Password, fields.PasswordConfirm).subscribe(
							// Success
							() => {
								this.doAlert("Success!", "Your password was successfully updated.");
							},

							// Error
							(err) => {
								this.doAlert("Oops!", err.error.error);
							}
						);
					}
				}
			]
		});

		await alert.present();
	}

	//
	// Show alert message if actions failed.
	//
	async doAlert(header: string, msg: string) {
		const alert = await this.alertController.create({
			header: header,
			subHeader: '',
			message: msg,
			buttons: ['OK']
		});

		await alert.present();
	}

	//
	// Do Logout TODO(spicer): Send message back to home to change tab.
	//
	doLogout() {
		this.meService.logout();
		this.router.navigate(['intro']);
	}
}

/* End File */
