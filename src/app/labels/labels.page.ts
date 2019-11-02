//
// Date: 2019-11-01
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import { Component, OnInit } from '@angular/core';
import { LabelService } from '../services/label.service';
import { Label } from '../models/label.model';
import { NavController } from '@ionic/angular';

@Component({
	selector: 'app-labels',
	templateUrl: './labels.page.html'
})

export class LabelsPage implements OnInit {
	labels: Label[] = [];
	checked: Label[] = [];
	newLabel: string = "";

	//
	// Constructor
	//
	constructor(public labelService: LabelService, public navCtrl: NavController) { }

	//
	// ngOnInit
	//
	ngOnInit() {
		// Load page data
		this.getLabels();
	}

	//
	// Save label entry
	//
	save() {
		this.labelService.labelsSelected.emit(this.checked);
		this.navCtrl.navigateBack('/ledger/add');
	}

	//
	// Get labels
	//
	getLabels() {
		this.labelService.get().subscribe(res => {
			this.labels = res;
		});
	}

	//
	// Add Label
	//
	addLabel() {
		let l = new Label();
		l.Name = this.newLabel;
		l.AccountId = Number(localStorage.getItem('account_id'));

		//  Create label on BE
		this.labelService.create(l).subscribe(res => {
			this.newLabel = "";
			this.checked.push(res);
			this.getLabels();
		});
	}

	//
	// On check
	//
	onCheck(row: Label) {
		// Look through and remove if needed
		for (let i = 0; i < this.checked.length; i++) {
			if (this.checked[i].Id == row.Id) {
				this.checked.splice(i, 1);
				return;
			}
		}

		// Add to checked
		this.checked.push(row);
	}

	//
	// See if a label row is checked
	//
	isChecked(row: Label) {
		// Look through the known checked.
		for (let i = 0; i < this.checked.length; i++) {
			if (this.checked[i].Id == row.Id) {
				return true;
			}
		}

		// If we made it here it is not checked.
		return false;
	}
}

/* End File */
