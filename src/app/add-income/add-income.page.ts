//
// Date: 2019-11-01
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import { Component, OnInit } from '@angular/core';
import { Contact } from '../models/contact.model';
import { ContactService } from '../services/contact.service';
import { AlertController } from '@ionic/angular';
import { Ledger } from '../models/ledger.model';

@Component({
	selector: 'app-add-income',
	templateUrl: './add-income.page.html'
})

export class AddIncomePage implements OnInit {
	contacts: Contact[] = [];
	contactText: string = "";
	ledger: Ledger = new Ledger();

	//
	// Constructor
	//
	constructor(public contactService: ContactService, public alertController: AlertController) { }

	//
	// ngOnInit
	//
	ngOnInit() {
		// Load page Data
		this.getContacts();
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
	// onContactChange is when the  contact field changes
	//
	onContactChange() {
		this.ledger.Contact = new Contact();
		this.ledger.Contact.Name = this.contactText;
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
}

/* End File */
