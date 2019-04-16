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

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html'
})

export class SettingsComponent implements OnInit {
	version: string = environment.version;

	//
	// Construct.
	//
	constructor(private router: Router, private meService: MeService, private alertController: AlertController) { }

	//
	// NgInit
	//
	ngOnInit() { }


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
					value: ''
				}
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
	// Change password
	//
	async doChangePasswordPrompt() {
		const alert = await this.alertController.create({
			header: 'Change Password',
			inputs: [
				{
					name: 'Password',
					type: 'password',
					placeholder: 'Password',
					value: ''
				},
				{
					name: 'Password',
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
	// Do Logout TODO(spicer): Send message back to home to change tab.
	//
	doLogout() {
		this.meService.logout();
		this.router.navigate(['intro']);
	}
}

/* End File */
