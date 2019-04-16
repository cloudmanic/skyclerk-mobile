//
// Date: 2019-04-14
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import { map } from "rxjs/operators";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Ledger } from '../models/ledger.model';

@Injectable({
	providedIn: 'root'
})

export class LedgerService {
	//
	// Constructor
	//
	constructor(private http: HttpClient) { }

	//
	// Get me
	//
	get(): Observable<Ledger[]> {
		let accountId = localStorage.getItem('account_id');

		return this.http.get<Ledger[]>(environment.app_server + '/api/v3/' + accountId + '/ledger')
			.pipe(map(res => res.map(res => new Ledger().deserialize(res))));
	}
}

/* End File */
