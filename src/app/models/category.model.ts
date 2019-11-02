//
// Date: 2019-04-14
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import { Serializable } from './serializable.model';

export class Category implements Serializable {
	Id: number = 0;
	AccountId: number = 0;
	Name: string = "";
	Type: string = "";

	//
	// Json to Object.
	//
	deserialize(json: Object): this {
		this.Id = json["id"];
		this.AccountId = json["account_id"];
		this.Name = json["name"];
		this.Type = json["type"];
		return this;
	}

	//
	// Model to JS Object.
	//
	serialize(obj: Category): Object {
		let rt = {
			id: obj.Id,
			account_id: obj.AccountId,
			name: obj.Name,
			type: obj.Type
		}
		return rt;
	}
}

/* End File */
