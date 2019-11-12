//
// Date: 2019-11-01
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';


import { LedgerViewPage } from './ledger-view.page';
import { AgmCoreModule } from '@agm/core';

const routes: Routes = [
	{
		path: '',
		component: LedgerViewPage
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		AgmCoreModule.forRoot({ apiKey: 'AIzaSyCc8fAAyASKh3FzA0IXCjIKFl5oFF5i1zU' }),
		RouterModule.forChild(routes)
	],
	declarations: [LedgerViewPage]
})
export class LedgeViewPageModule { }

/* End File */
