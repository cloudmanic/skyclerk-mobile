//
// Date: 2019-04-14
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import { map } from "rxjs/operators";
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { SnapClerk } from '../models/snapclerk.model';
import { FileTransfer, FileUploadOptions, FileTransferObject, FileUploadResult } from '@ionic-native/file-transfer/ngx';

@Injectable({
	providedIn: 'root'
})

export class SnapClerkService {
	// Used to start the upload of a receipt
	upload = new EventEmitter<SnapClerkUploadRequest>();

	//
	// Constructor
	//
	constructor(private http: HttpClient, private fileTransfer: FileTransfer) { }

	//
	// Get me
	//
	get(page: number, order: string, sort: string): Observable<SnapClerkResponse> {
		let accountId = localStorage.getItem('account_id');
		let url = `${environment.app_server}/api/v3/${accountId}/snapclerk?page=${page}&order=${order}&sort=${sort}`;

		return this.http.get<SnapClerk[]>(url, { observe: 'response' }).pipe(map((res) => {
			// Setup data
			let data: SnapClerk[] = [];
			let lastPage = false;

			// Serialize the response.
			for (let i = 0; i < res.body.length; i++) {
				data.push(new SnapClerk().deserialize(res.body[i]));
			}

			// Build last page
			if (res.headers.get('X-Last-Page') == "true") {
				lastPage = true;
			}

			// Return happy.
			return new SnapClerkResponse(lastPage, Number(res.headers.get('X-Offset')), Number(res.headers.get('X-Limit')), Number(res.headers.get('X-No-Limit-Count')), data);
		}));
	}

	//
	// Create new snapclerk
	//
	create(photo: string, type: string, note: string, labels: string, category: string): Promise<FileUploadResult> {
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
			params: {
				note: note,
				labels: labels,
				category: category
			}
		}

		// Return happy.
		return fileTransfer.upload(photo, `${environment.app_server}/api/v3/${accountId}/snapclerk`, options);
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

//
// SnapClerk upload request
//
export interface SnapClerkUploadRequest {
	photo: string,
	photoWeb: string,
	type: string,
	category: string,
	labels: string,
	note: string,
	lat: string,
	log: string
}

//
// SnapClerk Response
//
export class SnapClerkResponse {
	constructor(
		public LastPage: boolean,
		public Offset: number,
		public Limit: number,
		public NoLimitCount: number,
		public Data: SnapClerk[]
	) { }
}

/* End File */
