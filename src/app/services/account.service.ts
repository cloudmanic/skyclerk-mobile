//
// Date: 2019-09-20
// Author: Spicer Matthews (spicer@skyclerk.com)
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import { map } from "rxjs/operators";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Account } from '../models/account.model';
import { TrackService } from './track.service';

@Injectable({
	providedIn: 'root'
})

export class AccountService {
	//
	// Constructor
	//
	constructor(private http: HttpClient, private trackService: TrackService) { }

	//
	// Get by ID
	//
	getAccount(): Observable<Account> {
		let accountId = localStorage.getItem('account_id');
		let url = `${environment.app_server}/api/v3/${accountId}/account`;
		return this.http.get<Account>(url).pipe(map(res => new Account().deserialize(res)));
	}

	//
	// Update the account update
	//
	update(acct: Account): Observable<Account> {
		let accountId = localStorage.getItem('account_id');
		acct.Id = Number(accountId);

		return this.http.put<Account>(`${environment.app_server}/api/v3/${accountId}/account`, new Account().serialize(acct))
			.pipe(map(res => {
				let a = new Account().deserialize(res);

				// Track event.
				this.trackService.event('account-update', { app: "mobile", "accountId": accountId });

				return a;
			}));
	}

	//
	// Clear account - clears all account data.
	//
	clear(): Observable<Boolean> {
		let accountId = localStorage.getItem('account_id');

		return this.http.post<Boolean>(`${environment.app_server}/api/v3/${accountId}/account/clear`, {})
			.pipe(map(() => {
				// Track event.
				this.trackService.event('account-clear', { app: "mobile", "accountId": accountId });

				return true;
			}));
	}

	//
	// Delete account - delete account.
	//
	delete(): Observable<Account[]> {
		let accountId = localStorage.getItem('account_id');

		return this.http.post<Account[]>(`${environment.app_server}/api/v3/${accountId}/account/delete`, {})
			.pipe(map((res) => {
				// Track event.
				this.trackService.event('account-delete', { app: "mobile", "accountId": accountId });

				let a = [];

				for (let i = 0; i < res.length; i++) {
					a.push(new Account().deserialize(res[i]));
				}

				return a;
			}));
	}

	//
	// New account - create new account.
	//
	create(name: string): Observable<Account> {
		let accountId = localStorage.getItem('account_id');

		return this.http.post<Account>(`${environment.app_server}/api/v3/${accountId}/account/new`, { name: name })
			.pipe(map(res => {
				let a = new Account().deserialize(res);

				// Track event.
				this.trackService.event('account-new', { app: "mobile", "accountId": a.Id });

				return a;
			}));
	}
}

/* End File */
