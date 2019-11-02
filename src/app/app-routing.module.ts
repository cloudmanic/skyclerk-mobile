//
// Date: 2019-04-14
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SessionGuard } from './services/auth.guard';

const routes: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'intro', loadChildren: './intro/intro.module#IntroPageModule' },
	{ path: 'login', loadChildren: './login/login.module#LoginPageModule' },
	{ path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
	{ path: 'home', loadChildren: './home/home.module#HomePageModule', canActivate: [SessionGuard] },
	{ path: 'ledger/add', loadChildren: './ledger-modify/ledger-modify.module#LedgerModfyPageModule', canActivate: [SessionGuard] },
	{ path: 'labels', loadChildren: './labels/labels.module#LabelsPageModule', canActivate: [SessionGuard] },
	{ path: 'view-attachment', loadChildren: './view-attachment/view-attachment.module#ViewAttachmentPageModule', canActivate: [SessionGuard] },
	{ path: 'snapclerk/upload-receipt', loadChildren: './snapclerk/upload-receipt/upload-receipt.module#UploadReceiptPageModule', canActivate: [SessionGuard] },
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }

/* End File */
