//
// Date: 2019-04-23
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import { Component, OnInit } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { SnapClerkService } from '../services/snapckerk.service';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';


const { Camera } = Plugins;

@Component({
	selector: 'app-upload-receipt',
	templateUrl: './upload-receipt.page.html',
	styleUrls: ['./upload-receipt.page.scss'],
})

export class UploadReceiptPage implements OnInit {
	photo: string = "";
	category: string = "";
	note: string = "";
	labels: string = "label #1, label #2, label #3";
	uploadPhoto: string = "";
	uploadFileType: string = "";
	categories: Category[] = [];

	//
	// Constructor
	//
	constructor(
		public platform: Platform,
		public categoryService: CategoryService,
		public snapClerkService: SnapClerkService,
		public alertController: AlertController) { }

	//
	// NgOnInit
	//
	ngOnInit() {
		this.loadCategories();
	}

	//
	// Load categories
	//
	loadCategories() {
		this.categoryService.get().subscribe(res => {
			this.categories = res;
		});
	}

	//
	// Submit receipt
	//
	doSumbit() {
		let rt = {
			photo: this.uploadPhoto,
			photoWeb: this.photo,
			type: this.uploadFileType,
			category: this.category,
			labels: this.labels,
			note: this.note,
			lat: "",
			log: ""
		}

		// Send data back to the home screen to process.
		this.snapClerkService.upload.emit(rt);
	}

	//
	// Get photo to attach to this SnapClerk
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

	//
	// doAccounts - Show the accounts selector.
	//
	async doCategorySelect() {
		// Build inputs
		let inputs = []

		for (let i = 0; i < this.categories.length; i++) {
			let row = this.categories[i];

			// Only want expense categories
			if (row.Type != "expense") {
				continue;
			}

			// See if it is checked.
			let checked = false;
			if (this.category == row.Name) {
				checked = true;
			}

			inputs.push({
				name: 'radio' + i,
				type: 'radio',
				label: row.Name,
				value: row.Name,
				checked: checked
			});
		}

		// Show the alert.
		const alert = await this.alertController.create({
			header: 'Categories',
			inputs: inputs,
			buttons: [
				{
					text: 'Select',
					handler: (name) => {
						this.category = name;
					}
				}
			]
		});

		await alert.present();
	}
}


/* End File */
