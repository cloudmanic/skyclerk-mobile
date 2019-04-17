//
// Date: 2019-04-16
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-ledger-list-header',
	templateUrl: './list-header.component.html'
})

export class ListHeaderComponent implements OnInit {
	@Input() activeTableHeader: string = "";
	@Output() toggleHeader: EventEmitter<any> = new EventEmitter<any>();

	//
	// Constructor
	//
	constructor() { }

	//
	// NgInit
	//
	ngOnInit() { }

	//
	// Click the header of the table.
	//
	doTableHeaderClick() {
		this.toggleHeader.emit('account');
	}

}

/* End File */
