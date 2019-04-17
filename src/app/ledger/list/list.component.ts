//
// Date: 2019-04-16
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import { Component, OnInit, Input } from '@angular/core';
import { Ledger } from 'src/app/models/ledger.model';

@Component({
	selector: 'app-ledger-list',
	templateUrl: './list.component.html'
})

export class ListComponent implements OnInit {
	@Input() ledgers: Ledger[] = [];

	//
	// Constructor
	//
	constructor() { }

	//
	// NgInit
	//
	ngOnInit() { }

}

/* End File */
