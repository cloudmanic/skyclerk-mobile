//
// Date: 2019-04-23
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import { Component, OnInit, Input } from '@angular/core';
import { SnapClerk } from 'src/app/models/snapclerk.model';

@Component({
	selector: 'app-snapclerk-list',
	templateUrl: './list.component.html'
})

export class ListComponent implements OnInit {
	@Input() snapclerks: SnapClerk[] = [];

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
		//this.loadMore.emit(true);
	}

	//
	// Get color
	//
	getColor(status: string): string {

		switch (status) {
			case "Pending":
				return "warning";

			case "Rejected":
				return "danger";
		}

		return "success";
	}
}

/* End File */
