//
// Date: 2019-04-23
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { SnapClerkService } from '../services/snapckerk.service';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';

const { Camera, Filesystem } = Plugins;

@Component({
	selector: 'app-upload-receipt',
	templateUrl: './upload-receipt.page.html',
	styleUrls: ['./upload-receipt.page.scss'],
})

export class UploadReceiptPage implements OnInit {
	photo: string = "";
	category: string = "Spicer Test Category";
	note: string = "Note....";
	labels: string = "label #1, label #2, label #3";
	uploadBase64: string = "";
	uploadFileType: string = "";

	//
	// Constructor
	//
	constructor(public platform: Platform, public snapClerkService: SnapClerkService, public loadingController: LoadingController, public alertController: AlertController) { }

	//
	// NgOnInit
	//
	ngOnInit() { }

	//
	// Submit receipt
	//
	doSumbit() {
		let rt = {
			photo: this.uploadBase64,
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
			quality: 90,
			width: 1000,
			allowEditing: false,
			saveToGallery: true,
			correctOrientation: true,
			resultType: CameraResultType.Uri,
			source: CameraSource.Prompt
		});

		// Show image on upload screen.
		this.photo = image.webPath;

		// Read file.
		let img = await Filesystem.readFile({ path: image.path });

		// File we upload.
		this.uploadBase64 = img.data;
		this.uploadFileType = "image/" + image.format;
	}
}


/* End File */
