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

@Injectable({
	providedIn: 'root'
})

export class MeService {
	//
	// Constructor
	//
	constructor(private http: HttpClient) { }

	//
	// Log user out.
	//
	logout() {
		localStorage.removeItem('user_id');
		localStorage.removeItem('account_id');
		localStorage.removeItem('access_token');
	}

	//
	// Get me
	//
	get(): Observable<Me> {
		return this.http.get<Me>(environment.app_server + '/oauth/me')
			.pipe(map(res => new Me().deserialize(res)));
	}
}

/* End File */
