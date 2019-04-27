import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html'
})
export class AppComponent {
	constructor(private platform: Platform) {
		this.initializeApp();
	}

	initializeApp() {
		this.platform.ready().then(() => {
			// Ingore this stuff if using browser.
			if (this.platform.is("hybrid")) {
				SplashScreen.hide();
			}
		});
	}
}
