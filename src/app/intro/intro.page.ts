//
// Date: 2019-04-14
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-intro',
	templateUrl: './intro.page.html'
})

export class IntroPage {
	//
	// Constructor
	//
	constructor(private router: Router) {
		// If we have an access token / user_id redirect to the ledgers screen.
		if (localStorage.getItem('access_token') && localStorage.getItem('user_id')) {
			this.router.navigate(['ledgers']);
		}
	}
}

/* End File */
