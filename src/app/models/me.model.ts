//
// Date: 2019-04-14
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import { Serializable } from './serializable.model';

export class Me implements Serializable {
	Id: number;
	Email: string;
	FirstName: string;
	LastName: string;

	//
	// Json to Object.
	//
	deserialize(json: Object): this {
		this.Id = json["id"];
		this.Email = json["email"];
		this.FirstName = json["first_name"];
		this.LastName = json["last_name"];
		return this;
	}

	//
	// Model to JS Object.
	//
	serialize(obj: Me): Object {
		let rt = {
			id: obj.Id,
			email: obj.Email,
			first_name: obj.FirstName,
			last_name: obj.LastName
		}
		return rt;
	}
}

/* End File */
