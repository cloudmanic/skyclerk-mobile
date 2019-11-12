import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AgmCoreModule } from '@agm/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

// Services
import { AuthService } from './services/auth.service';
import { TokenInterceptor } from './services/token.interceptor';
import { LedgerService } from './services/ledger.service';

import { FileTransfer } from '@ionic-native/file-transfer/ngx';


// class CameraMock extends Camera {
// 	getPicture(options) {
// 		return new Promise((resolve, reject) => {
// 			resolve("BASE_64_ENCODED_DATA_GOES_HERE");
// 		})
// 	}
// }

@NgModule({
	declarations: [AppComponent],
	entryComponents: [],
	imports: [
		BrowserModule,
		IonicModule.forRoot(),
		AppRoutingModule,
		HttpClientModule,
		AgmCoreModule.forRoot({ apiKey: 'AIzaSyCc8fAAyASKh3FzA0IXCjIKFl5oFF5i1zU' })
	],
	providers: [
		AuthService,
		LedgerService,
		FileTransfer,
		//{ provide: Camera, useClass: CameraMock },
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
