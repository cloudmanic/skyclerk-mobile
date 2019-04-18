//
// Date: 2019-04-16
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LedgerResponse } from 'src/app/services/ledger.service';
import { Ledger } from 'src/app/models/ledger.model';

@Component({
	selector: 'app-ledger-list',
	templateUrl: './list.component.html'
})

export class ListComponent implements OnInit {
	@Input() ledgers: Ledger[] = [];
	@Input() lastPage: boolean = true;
	@Output() loadMore: EventEmitter<boolean> = new EventEmitter<boolean>();

	//
	// Constructor
	//
	constructor() { }

	//
	// NgInit
	//
	ngOnInit() { }

	//
	// Append more data on to the list.
	//
	loadMoreData() {
		this.loadMore.emit(true);
	}
}

/* End File */
