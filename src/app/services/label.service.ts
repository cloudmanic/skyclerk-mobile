//
// Date: 2019-04-27
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import { map } from "rxjs/operators";
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Label } from '../models/label.model';

@Injectable({
	providedIn: 'root'
})

export class LabelService {
	// Used when adding labels and need to tell another screen
	labelsSelected = new EventEmitter<Label[]>();

	//
	// Constructor
	//
	constructor(private http: HttpClient) { }

	//
	// Get labels
	//
	get(): Observable<Label[]> {
		let accountId = localStorage.getItem('account_id');
		let url = environment.app_server + '/api/v3/' + accountId + '/labels';
		return this.http.get<Label[]>(url)
			.pipe(map(res => res.map(res => new Label().deserialize(res))));
	}

	//
	// Create a new label
	//
	create(lb: Label): Observable<Label> {
		let accountId = localStorage.getItem('account_id');
		lb.AccountId = Number(accountId);

		return this.http.post<number>(`${environment.app_server}/api/v3/${accountId}/labels`, new Label().serialize(lb))
			.pipe(map(res => {
				let lb = new Label().deserialize(res);

				// // Track event.
				// this.trackService.event('label-create', { app: "web", "accountId": accountId });

				return lb;
			}));
	}
}


/* End File */
