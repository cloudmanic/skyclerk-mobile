import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-ledgers',
	templateUrl: './ledgers.page.html'
})

export class LedgersPage implements OnInit {

	tabs: string = "ledgers";

	constructor() { }

	ngOnInit() {
	}

}
