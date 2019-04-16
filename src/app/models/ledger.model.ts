//
// Date: 2019-04-14
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import { Serializable } from './serializable.model';

export class Ledger implements Serializable {
	Id: number;
	AccountId: number;
	Date: Date;
	Amount: number;
	Note: string;

	//
	// Json to Object.
	//
	deserialize(json: Object): this {
		this.Id = json["id"];
		this.AccountId = json["account_id"];
		this.Date = json["date"];
		this.Amount = json["amount"];
		this.Note = json["note"];
		return this;
	}

	//
	// Model to JS Object.
	//
	serialize(obj: Ledger): Object {
		let rt = {
			id: obj.Id,
			account_id: obj.AccountId,
			date: obj.Date,
			amount: obj.Amount,
			note: obj.Note
		}
		return rt;
	}
}

/* End File */
