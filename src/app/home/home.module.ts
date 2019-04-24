//
// Date: 2019-04-14
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';
import { SettingsComponent } from '../settings/settings.component';
import { ListComponent } from '../ledger/list/list.component';
import { ListHeaderComponent } from '../ledger/list-header/list-header.component';
import { AccountHeaderComponent } from './account-header/account-header.component';
import { ListComponent as SnapClerkListComponent } from '../snapclerk/list/list.component';

const routes: Routes = [
	{
		path: '',
		component: HomePage
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes)
	],
	declarations: [
		HomePage,
		SettingsComponent,
		ListComponent,
		SnapClerkListComponent,
		ListHeaderComponent,
		AccountHeaderComponent
	]
})
export class HomePageModule { }

/* End File */
