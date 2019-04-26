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
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';

const { Camera, Filesystem, App, BackgroundTask } = Plugins;

@Component({
	selector: 'app-upload-receipt',
	templateUrl: './upload-receipt.page.html',
	styleUrls: ['./upload-receipt.page.scss'],
})

export class UploadReceiptPage implements OnInit {
	photo: string = "";
	uploading: boolean = false;
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
	ngOnInit() {

		console.log("HEREER");

		// We use a background task to make sure our uploads complete.
		App.addListener('appStateChange', (state) => {

			if (state.isActive) {
				console.log("App went to active.");
			}

			if (!state.isActive) {

				console.log("App went to background.");

				// The app has become inactive. We should check if we have some work left to do, and, if so,
				// execute a background task that will allow us to finish that work before the OS
				// suspends or terminates our app:

				let taskId = BackgroundTask.beforeExit(async () => {


					// In this function We might finish an upload, let a network request
					// finish, persist some data, or perform some other task

					//clearInterval(r)
					//this.i = 0;

					// Super long loop looking for upload to be complete.
					for (var i = 0; i < 1e18; i++) {

						// Check until the upload is done.
						if (!this.uploading) {
							console.log("Upload done.");
							break;
						}

					}

					// Must call in order to end our task otherwise
					// we risk our app being terminated, and possibly
					// being labeled as impacting battery life
					BackgroundTask.finish({
						taskId
					});
				});
			}
		});

	}

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

		// Set our uploading flag
		this.uploading = true;

		// Post file to server
		this.snapClerkService.create(formData).subscribe(
			res => {
				// TODO(spicer): pass this to the parent view.
				console.log(res);

				// Kill uploading flag.
				this.uploading = false;;

				loading.dismiss();
			},

			error => {
				// Hide loading.
				loading.dismiss();

				// Show error in an alert
				console.log(error);
				this.presentErrorAlert(error.message);

				// Kill uploading flag.
				this.uploading = false;;
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
