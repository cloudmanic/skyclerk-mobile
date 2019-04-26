//
// Date: 2019-04-23
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { SnapClerkService } from '../services/snapckerk.service';
import { File as FileModel } from '../models/file.model';
import { Plugins, CameraResultType, CameraSource, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';

const { Camera, Filesystem } = Plugins;

@Component({
	selector: 'app-upload-receipt',
	templateUrl: './upload-receipt.page.html',
	styleUrls: ['./upload-receipt.page.scss'],
})

export class UploadReceiptPage implements OnInit {
	photo: string = "";
	vendor: string = "Spicer Test Vendor";
	note: string = "Note....";
	labels: string = "label #1, label #2, label #3"

	//
	// Constructor
	//
	constructor(public snapClerkService: SnapClerkService, public loadingController: LoadingController, public alertController: AlertController) { }


	//
	// NgOnInit
	//
	ngOnInit() { }

	//
	// Get photo to attach to this SnapClerk
	//
	async doGetPhoto() {
		// Get image.
		const image = await Camera.getPhoto({
			quality: 90,
			allowEditing: false,
			saveToGallery: true,
			correctOrientation: true,
			resultType: CameraResultType.Uri,
			source: CameraSource.Prompt
		});

		console.log('Got image back', image.path, image.webPath, image.format, image.exif);

		// Show image on upload screen.
		this.photo = image.webPath;

		// Startup load to server
		let img = await Filesystem.readFile({ path: image.path });
		const imgBlob = FileModel.b64toBlob(img.data, "image/" + image.format);

		// Build form data.
		const formData = new FormData();
		formData.append('file', imgBlob, this.createFileName(image.format));
		formData.append('note', this.note);
		formData.append('labels', this.labels);
		formData.append('contact', this.vendor);

		// Start the image upload
		this.uploadImageData(formData);
	}

	//
	// Upload image to server.
	//
	async uploadImageData(formData: FormData) {
		const loading = await this.loadingController.create({ message: 'Uploading your receipt for processing.' });
		await loading.present();

		// Post file to server
		this.snapClerkService.create(formData).subscribe(
			res => {
				// TODO(spicer): pass this to the parent view.
				console.log(res);

				loading.dismiss();
			},

			error => {
				loading.dismiss();
				console.log(error);
				this.presentErrorAlert(error.message);
			}
		);
	}

	//
	// Show error alert.
	//
	async  presentErrorAlert(msg: string) {
		const alert = await this.alertController.create({
			header: 'Oops! Upload Error',
			subHeader: '',
			message: msg,
			buttons: ['OK']
		});
		return await alert.present();
	}

	//
	// Create a file name for this upload.
	//
	createFileName(type: string) {
		let d = new Date();
		let n = d.getTime();
		return "sc-mobile-" + n + "." + type;
	}
}


/* End File */
