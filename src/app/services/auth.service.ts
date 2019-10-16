//
// Date: 2019-04-14
// Author: Spicer Matthews (spicer@skyclerk.com)
// Last Modified by: Spicer Matthews
// Copyright: 2019 Cloudmanic Labs, LLC. All rights reserved.
//

import { map } from "rxjs/operators";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})

export class AuthService {
	//
	// Constructor.
	//
	constructor(private http: HttpClient) { }

	//
	// Log user in.
	//
	login(email: string, pass: string): Observable<LoginResponse> {
		// Build POST
		let post = {
			username: email,
			password: pass,
			client_id: environment.client_id,
			grant_type: 'password'
		}

		// Send Request to BE.
		return this.http.post<LoginResponse>(environment.app_server + '/oauth/token', post)
			.pipe(map(res => {
				// Store access token in local storage.
				localStorage.setItem('user_id', res["user_id"].toString());
				localStorage.setItem('access_token', res["access_token"]);
				localStorage.setItem('user_email', email);

				return {
					user_id: res["user_id"],
					access_token: res["access_token"]
				};
			}));
	}

	//
	// Regiser a new account.
	//
	register(email: string, pass: string, name: string) {
		// Figure out name
		let s = name.split(" ");
		let first = "";
		let last = "";

		if (s.length == 2) {
			first = s[0];
			last = s[1];
		} else {
			first = name;
			last = "Unknown";
		}

		// Build POST
		let post = {
			email: email,
			password: pass,
			first: first,
			last: last,
			client_id: environment.client_id,
			token: ''
		}

		// Send Request to BE.
		return this.http.post<RegisterResponse>(environment.app_server + '/register', post)
			.pipe(map(res => {
				// Store access token in local storage.
				localStorage.setItem('account_id', res["account_id"].toString());
				localStorage.setItem('user_id', res["user_id"].toString());
				localStorage.setItem('access_token', res["access_token"]);
				localStorage.setItem('user_email', email);

				return {
					account_id: res["account_id"],
					user_id: res["user_id"],
					access_token: res["access_token"]
				};
			}));
	}
}

// Response from a register request.
export interface RegisterResponse {
	user_id: number,
	access_token: string,
	account_id: number
}

// Response from a login request
export interface LoginResponse {
	user_id: number,
	access_token: string
}

/* End File */
