//
// Date: 2019-08-26
// Author: Spicer Matthews (spicer@skyclerk.com)
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import * as mixpanel from 'mixpanel-browser';
import { Injectable } from '@angular/core';
import { Me } from '../models/me.model';
import { environment } from 'src/environments/environment';

declare let FS: any;

@Injectable({
	providedIn: 'root'
})

export class TrackService {
	//
	// Construct.
	//
	constructor() {
		if (environment.mixpanel_key.length == 0) {
			return;
		}

		mixpanel.init(environment.mixpanel_key);
	}

	//
	// Tell our tracking service who the user is.
	//
	identifyUser(user: Me) {
		if (environment.mixpanel_key.length == 0) {
			return;
		}

		mixpanel.people.set({ "$first_name": user.FirstName, "$last_name": user.LastName, "$email": user.Email });
		mixpanel.identify(user.Id);
	}

	//
	// Track an event.
	//
	event(name: string, params?: any) {
		if (environment.mixpanel_key.length == 0) {
			return;
		}

		// Add in account id.
		let accountId = localStorage.getItem('account_id');
		params.accountId = accountId;
		params.mobileAppVersion = environment.version;

		mixpanel.track(name, params);
	}
}

/* End File */
