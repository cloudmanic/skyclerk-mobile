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
import { Ledger } from '../models/ledger.model';
import { TrackService } from './track.service';

@Injectable({
	providedIn: 'root'
})

export class LedgerService {
	// This is used to detect if we are currently working on a ledger.
	// For example if we are on the ledger add page and we move to the
	// add labels page. Or this is used when editing a ledger as a way
	// to pass the ledger between screens.
	activeLedger: Ledger = new Ledger();

	// This is used to tell the system one of our ledgers has changed.
	refresh = new EventEmitter<boolean>();

	// Call this when a ledger entry has been deleted.
	deleted = new EventEmitter<boolean>();

	//
	// Constructor
	//
	constructor(private http: HttpClient, private trackService: TrackService) { }

	//
	// Get ledger
	//
	get(page: number, type: string, search: string): Observable<LedgerResponse> {
		let accountId = localStorage.getItem('account_id');
		let url = environment.app_server + '/api/v3/' + accountId + '/ledger?page=' + page + '&type=' + type + '&search=' + search;

		return this.http.get<Ledger[]>(url, { observe: 'response' }).pipe(map((res) => {
			// Setup data
			let data: Ledger[] = [];
			let lastPage = false;

			// Serialize the response.
			for (let i = 0; i < res.body.length; i++) {
				data.push(new Ledger().deserialize(res.body[i]));
			}

			// Build last page
			if (res.headers.get('X-Last-Page') == "true") {
				lastPage = true;
			}

			// Return happy.
			return new LedgerResponse(lastPage, Number(res.headers.get('X-Offset')), Number(res.headers.get('X-Limit')), Number(res.headers.get('X-No-Limit-Count')), data);
		}));
	}

	//
	// Get by ID
	//
	getById(id: number): Observable<Ledger> {
		let accountId = localStorage.getItem('account_id');
		let url = `${environment.app_server}/api/v3/${accountId}/ledger/${id}`;
		return this.http.get<Ledger>(url).pipe(map(res => new Ledger().deserialize(res)));
	}

	//
	// Delete a ledger
	//
	delete(ledger: Ledger): Observable<Boolean> {
		let accountId = localStorage.getItem('account_id');
		ledger.AccountId = Number(accountId);

		return this.http.delete<Boolean>(`${environment.app_server}/api/v3/${accountId}/ledger/${ledger.Id}`, {})
			.pipe(map(() => {
				// Track event.
				this.trackService.event('ledger-delete', { app: "mobile", "accountId": accountId });

				return true;
			}));
	}

	//
	// Create a new ledger
	//
	create(ledger: Ledger): Observable<Ledger> {
		let accountId = localStorage.getItem('account_id');
		ledger.AccountId = Number(accountId);

		return this.http.post<Ledger>(`${environment.app_server}/api/v3/${accountId}/ledger`, new Ledger().serialize(ledger))
			.pipe(map(res => {
				let lg = new Ledger().deserialize(res);
				let type = "expense";

				if (lg.Amount > 0) {
					type = "income";
				}

				// Track event.
				this.trackService.event('ledger-create', { ledgerEntryType: type, app: "mobile", "accountId": accountId });

				return lg;
			}));
	}
}

//
// Ledger Response
//
export class LedgerResponse {
	constructor(
		public LastPage: boolean,
		public Offset: number,
		public Limit: number,
		public NoLimitCount: number,
		public Data: Ledger[]
	) { }
}

/* End File */
