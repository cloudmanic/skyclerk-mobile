import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { PingService } from './services/ping.service';
const { SplashScreen } = Plugins;

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html'
})
export class AppComponent {
	//
	// Constructor
	//
	constructor(private platform: Platform, private pingService: PingService) {
		// initialize app
		this.initializeApp();

		// Start server ping.
		this.pingService.startPing();
	}

	//
	// Initialize App
	//
	initializeApp() {
		this.platform.ready().then(() => {
			// Ingore this stuff if using browser.
			if (this.platform.is("hybrid")) {
				SplashScreen.hide();
			}
		});
	}
}

/* End File */
