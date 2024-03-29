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
import { Me } from '../models/me.model';
import { TrackService } from './track.service';

@Injectable({
	providedIn: 'root'
})

export class MeService {
	//
	// Constructor
	//
	constructor(private http: HttpClient, private trackService: TrackService) { }

	//
	// Log user out.
	//
	logout() {
		localStorage.removeItem('user_id');
		localStorage.removeItem('account_id');
		localStorage.removeItem('access_token');
		localStorage.removeItem('user_email');
	}

	//
	// Get me
	//
	get(): Observable<Me> {
		return this.http.get<Me>(environment.app_server + '/oauth/me')
			.pipe(map(res => {
				let me = new Me().deserialize(res);

				// Idenify the user.
				this.trackService.identifyUser(me);

				return me;
			}));
	}

	//
	// Update user
	//
	update(user: Me): Observable<Boolean> {
		let accountId = localStorage.getItem('account_id');
		let url = environment.app_server + '/api/v3/' + accountId + '/me';

		return this.http.put<Boolean>(url, { first_name: user.FirstName, last_name: user.LastName, email: user.Email })
			.pipe(map(() => {
				return true;
			}));
	}

	//
	// Update password for a user.
	//
	updatePassword(current: string, password: string, confirm: string): Observable<Boolean> {
		let accountId = localStorage.getItem('account_id');
		let url = environment.app_server + '/api/v3/' + accountId + '/me/change-password';

		return this.http.post<Boolean>(url, { current: current, password: password, confirm: confirm })
			.pipe(map(() => {
				return true;
			}));
	}
}

/* End File */
