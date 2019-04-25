//
// Date: 2019-04-23
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Component, OnInit } from '@angular/core';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { LoadingController } from '@ionic/angular';
import { SnapClerkService } from '../services/snapckerk.service';

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
	constructor(
		private snapClerkService: SnapClerkService,
		public camera: Camera,
		public webview: WebView,
		public file: File,
		public loadingController: LoadingController) { }


	//
	// NgOnInit
	//
	ngOnInit() { }

	//
	// Get photo to attach to this SnapClerk
	//
	doGetPhoto(sourceType: PictureSourceType) {
		let options: CameraOptions = {
			quality: 100,
			destinationType: this.camera.DestinationType.FILE_URI,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE,
			sourceType: sourceType
			// saveToPhotoAlbum: true,
			// correctOrientation: true
		}

		// Prompt user for an image.
		this.camera.getPicture(options).then(imagePath => {
			this.photo = this.webview.convertFileSrc(imagePath);
			this.startUpload(imagePath);
		}, (err) => {
			console.log(err);
			alert('Error while selecting photo.');
		});
	}

	//
	// Start the upload process.
	//
	// Helpful: https://devdactic.com/ionic-4-image-upload-storage/
	// TODO(spicer): the link above will help if we ever want to store the image
	// so we can upload the image at a later date.
	//
	startUpload(imgEntry) {
		this.file.resolveLocalFilesystemUrl(imgEntry)
			.then(entry => {
				(<FileEntry>entry).file(file => this.readFile(file))
			})
			.catch(err => {
				console.log(err);
				alert('Error while uploading photo.');
			});
	}

	//
	// Read file and add in any variables for snapclerk.
	//
	readFile(file: any) {
		const reader = new FileReader();
		reader.onloadend = () => {
			const formData = new FormData();
			const imgBlob = new Blob([reader.result], { type: file.type });

			// Build form data.
			formData.append('file', imgBlob, this.createFileName(file.type));
			formData.append('note', this.note);
			formData.append('labels', this.labels);
			formData.append('contact', this.vendor);

			// Start the image upload
			this.uploadImageData(formData);
		};
		reader.readAsArrayBuffer(file);
	}

	//
	// Upload image to server.
	//
	async uploadImageData(formData: FormData) {
		const loading = await this.loadingController.create({ message: 'Uploading your receipt for processing.' });
		await loading.present();

		// Post file to server
		this.snapClerkService.create(formData).subscribe(res => {
			console.log(res.File.Url);
			loading.dismiss();
		});
	}

	//
	// Create a file name for this upload.
	//
	createFileName(type: string) {
		let d = new Date();
		let n = d.getTime();
		return "sc-mobile-" + n + "." + type.split("/")[1];
	}
}


/* End File */
