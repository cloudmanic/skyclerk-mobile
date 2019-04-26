//
// Date: 2019-04-23
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import { Serializable } from './serializable.model';

export class File implements Serializable {
	Id: number;
	AccountId: number;
	Name: string;
	Type: string;
	Size: number;
	Url: string;
	Thumb600By600Url: string;

	//
	// Json to Object.
	//
	deserialize(json: Object): this {
		this.Id = json["id"];
		this.AccountId = json["account_id"];
		this.Name = json["name"];
		this.Type = json["type"];
		this.Size = json["size"];
		this.Url = json["url"];
		this.Thumb600By600Url = json["thumb_600_by_600_url"];
		return this;
	}

	//
	// Model to JS Object.
	//
	serialize(obj: File): Object {
		let rt = {
			id: obj.Id,
			account_id: obj.AccountId,
			name: obj.Name,
			type: obj.Type,
			size: obj.Size,
			url: obj.Url,
			thumb_600_by_600_url: obj.Thumb600By600Url
		}
		return rt;
	}

	//
	// Convert from base64 to a blob.
	//
	static b64toBlob(b64Data, contentType = '', sliceSize = 512) {
		const byteCharacters = atob(b64Data);
		const byteArrays = [];

		for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
			const slice = byteCharacters.slice(offset, offset + sliceSize);

			const byteNumbers = new Array(slice.length);
			for (let i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}

			const byteArray = new Uint8Array(byteNumbers);
			byteArrays.push(byteArray);
		}

		const blob = new Blob(byteArrays, { type: contentType });
		return blob;
	}
}

/* End File */
