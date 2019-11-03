//
// Date: 2019-04-14
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FileTransfer, FileUploadOptions, FileTransferObject, FileUploadResult } from '@ionic-native/file-transfer/ngx';

@Injectable({
	providedIn: 'root'
})

export class FileService {
	//
	// Constructor
	//
	constructor(private fileTransfer: FileTransfer) { }

	//
	// Upload a file. Returns the file ID
	//
	upload(photo: string, type: string): Promise<FileUploadResult> {
		const fileTransfer: FileTransferObject = this.fileTransfer.create();

		// Get accountId
		let accountId = localStorage.getItem('account_id');

		// Set the access token
		let accessToken = localStorage.getItem('access_token');

		// Setup load options.
		let options: FileUploadOptions = {
			fileKey: 'file',
			fileName: this.createFileName(type),
			mimeType: type,
			headers: {
				Authorization: `Bearer ${accessToken}`
			},
			params: {}
		}

		// Return happy.
		return fileTransfer.upload(photo, `${environment.app_server}/api/v3/${accountId}/files`, options);
	}

	//
	// Create a file name for this upload.
	//
	createFileName(type: string): string {
		let d = new Date();
		let n = d.getTime();
		return "sc-mobile-" + n + "." + type.split("/")[1];
	}
}

/* End File */
