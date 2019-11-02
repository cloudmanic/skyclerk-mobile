//
// Date: 2019-11-01
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import * as moment from 'moment';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Contact } from '../models/contact.model';
import { ContactService } from '../services/contact.service';
import { AlertController, PickerController, Platform, NavController } from '@ionic/angular';
import { Ledger } from '../models/ledger.model';
import { Category } from '../models/category.model';
import { CategoryService } from '../services/category.service';
import { LabelService } from '../services/label.service';
import { LedgerService } from '../services/ledger.service';
import { ActivatedRoute } from '@angular/router';
import { CameraSource, CameraResultType, Camera, Geolocation } from '@capacitor/core';

@Component({
	selector: 'app-ledger-modify',
	templateUrl: './ledger-modify.page.html'
})

export class LedgerModfyPage implements OnInit {
	type: string = "";
	photo: string = "";
	uploadPhoto: string = "";
	uploadFileType: string = "";
	contacts: Contact[] = [];
	categories: Category[] = [];
	contactText: string = "";
	categoryText: string = "";
	amount: number;
	ledger: Ledger = new Ledger();
	dateStr: string = new Date().toISOString();

	//
	// Constructor - Get query params from the url.
	//
	constructor(
		public route: ActivatedRoute,
		public location: Location,
		public platform: Platform,
		public navCtrl: NavController,
		public pickerController: PickerController,
		public contactService: ContactService,
		public categoryService: CategoryService,
		public alertController: AlertController,
		public ledgerService: LedgerService,
		public labelService: LabelService) {

		// Get the type of ledger entry.
		this.route.queryParams.subscribe(params => {
			this.type = params.type;
		});
	}

	//
	// ngOnInit
	//
	ngOnInit() {
		// Set ledger
		this.ledger.AccountId = Number(localStorage.getItem('account_id'));
		this.ledgerService.activeLedger = this.ledger;

		// Load page Data
		this.getContacts();
		this.getCategories();

		// Set the position.
		this.setCurrentPosition();

		// Labels were selected on another screen.
		this.labelService.labelsSelected.subscribe(res => {
			this.ledger.Labels = res;
			this.ledgerService.activeLedger = this.ledger;
		});
	}

	//
	// Save ledger entry
	//
	save() {
		// Add in date
		this.ledger.Date = moment(this.dateStr).toDate();

		// Add amount
		this.ledger.Amount = Number(this.amount);

		// Make it an expense entry.
		if (this.type == "expense") {
			this.ledger.Amount = this.ledger.Amount * -1;
		}

		// Send ledger to BE
		this.ledgerService.create(this.ledger).subscribe(
			// Success
			() => {
				this.ledgerService.refresh.emit(true);
				this.navCtrl.back();
			},

			// error
			(err) => {
				// System error
				if (typeof err.error.error == "string") {
					this.doErrorsPrompt("Ledger Errors", err.error.error);
					return;
				}

				// Field errors
				let e = [];
				for (let row in err.error.errors) {
					e.push("* " + err.error.errors[row]);
				}

				// Show error
				this.doErrorsPrompt("Ledger Errors", e.join("<br /><br />"));
			}
		);
	}

	//
	// Get contacts
	//
	getContacts() {
		this.contactService.get(1000, "").subscribe(res => {
			this.contacts = res;
		});
	}

	//
	// Get categories
	//
	getCategories() {
		this.categoryService.get().subscribe(res => {
			this.categories = res;
		});
	}

	//
	// onContactChange is when the  contact field changes
	//
	onContactChange() {
		// Get current account.
		let current = Number(localStorage.getItem('account_id'));

		// Build new Contact
		this.ledger.Contact = new Contact();
		this.ledger.Contact.AccountId = current;
		this.ledger.Contact.Name = this.contactText;
	}

	//
	// onCategoryChange on categoy change
	//
	onCategoryChange() {
		// Get current account.
		let current = Number(localStorage.getItem('account_id'));

		// Build new Category
		this.ledger.Category = new Category();
		this.ledger.Category.Type = this.type;
		this.ledger.Category.AccountId = current;
		this.ledger.Category.Name = this.categoryText;
	}

	//
	// Returns contact value
	//
	setsContactField() {
		if (this.ledger.Contact.Name.length > 0) {
			this.contactText = this.ledger.Contact.Name;
		} else {
			this.contactText = this.ledger.Contact.FirstName + ' ' + this.ledger.Contact.LastName;
		}
	}

	//
	// Set the current position of the user.
	//
	setCurrentPosition() {
		Geolocation.getCurrentPosition().then(cords => {
			this.ledger.Lat = cords.coords.latitude;
			this.ledger.Lon = cords.coords.longitude;
		})
	}

	//
	// If we have errors show them.
	//
	async doErrorsPrompt(header: string, errors: string) {
		const alert = await this.alertController.create({
			header: header,
			message: errors,
			buttons: ['Ok']
		});

		await alert.present();
	}

	//
	// doContacts - Show the contacts selector.
	//
	async doContacts() {
		// Build inputs
		let inputs = []

		for (let i = 0; i < this.contacts.length; i++) {
			let row = this.contacts[i];

			// Figure out name
			let name = row.Name
			if (name.length == 0) {
				name = row.FirstName + " " + row.LastName;
			}

			// Set active account.
			let checked = false;
			if (this.contactText == name) {
				checked = true;
			}

			inputs.push({
				name: 'radio' + i,
				type: 'radio',
				label: name,
				value: row,
				checked: checked
			});
		}

		// Show the alert.
		const alert = await this.alertController.create({
			header: 'Contacts',
			inputs: inputs,
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					cssClass: 'secondary'
				},
				{
					text: 'Select',
					handler: (contact) => {
						this.ledger.Contact = contact;
						this.setsContactField();
					}
				}
			]
		});

		await alert.present();
	}

	//
	// doCategories - Show the categories selector.
	//
	async doCategories() {
		// Build inputs
		let inputs = []

		for (let i = 0; i < this.categories.length; i++) {
			let row = this.categories[i];

			// Match category to the type.
			if (row.Type != this.type) {
				continue;
			}

			// Set active account.
			let checked = false;
			if (this.categoryText == row.Name) {
				checked = true;
			}

			inputs.push({
				name: 'radio' + i,
				type: 'radio',
				label: row.Name,
				value: row,
				checked: checked
			});
		}

		// Show the alert.
		const alert = await this.alertController.create({
			header: 'Categories',
			inputs: inputs,
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					cssClass: 'secondary'
				},
				{
					text: 'Select',
					handler: (category) => {
						this.ledger.Category = category;
						this.categoryText = category.Name;
					}
				}
			]
		});

		await alert.present();
	}

	//
	// Add a note to the ledger
	//
	async doNotePrompt() {
		const alert = await this.alertController.create({
			header: 'Ledger Note',
			inputs: [
				{
					name: 'Note',
					type: 'text',
					placeholder: 'Enter a ledger note...',
					value: ""
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
					text: 'Add Note',
					handler: (field) => {
						this.ledger.Note = field.Note;
					}
				}
			]
		});

		await alert.present();
	}

	//
	// Get photo to attach
	//
	async doGetPhoto() {
		// If we are in the browser we need to do sepcial things.
		if (!this.platform.is("hybrid")) {
			alert("Cam not support on web.");
			return;
		}

		// Get image.
		const image = await Camera.getPhoto({
			quality: 80,
			width: 1200,
			allowEditing: false,
			saveToGallery: true,
			correctOrientation: true,
			resultType: CameraResultType.Uri,
			source: CameraSource.Prompt
		});

		// Show image on upload screen.
		this.photo = image.webPath;

		// File we upload.
		this.uploadPhoto = image.path; //img.data;
		this.uploadFileType = "image/" + image.format;
	}
}

/* End File */
