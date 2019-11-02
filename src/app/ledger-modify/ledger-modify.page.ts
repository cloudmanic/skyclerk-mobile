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
import { AlertController, PickerController } from '@ionic/angular';
import { Ledger } from '../models/ledger.model';
import { Category } from '../models/category.model';
import { CategoryService } from '../services/category.service';
import { LabelService } from '../services/label.service';

@Component({
	selector: 'app-ledger-modify',
	templateUrl: './ledger-modify.page.html'
})

export class LedgerModfyPage implements OnInit {
	type: string = "income";
	contacts: Contact[] = [];
	categories: Category[] = [];
	contactText: string = "";
	categoryText: string = "";
	amount: number;
	ledger: Ledger = new Ledger();
	dateStr: string = new Date().toISOString();

	//
	// Constructor
	//
	constructor(
		public location: Location,
		public pickerController: PickerController,
		public contactService: ContactService,
		public categoryService: CategoryService,
		public alertController: AlertController,
		public labelService: LabelService) { }

	//
	// ngOnInit
	//
	ngOnInit() {
		// Set ledger
		this.ledger.AccountId = Number(localStorage.getItem('account_id'));

		// Load page Data
		this.getContacts();
		this.getCategories();

		// Labels were selected on another screen.
		this.labelService.labelsSelected.subscribe(res => {
			this.ledger.Labels = res;
		});
	}

	//
	// Save ledger entry
	//
	save() {
		// Add in date
		this.ledger.Date = moment(this.dateStr).toDate();

		// Add amount
		this.ledger.Amount = this.amount;

		console.log(this.ledger);
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
}

/* End File */
