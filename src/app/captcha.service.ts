// captch.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CaptchaService {
  private apiUrl = 'http://localhost:4200/api/Account/AccountCouldLogin'; 
  private captchaUrl = 'http://localhost:4200/get-captcha-image'; 
  constructor(private http: HttpClient) { }

  getCaptcha(): Observable<any> {
    return this.http.get<any>(this.captchaUrl, { responseType: 'json' });
  }

  login(username: string, password: string, captcha: Captcha, rememberMe: boolean, verificationNo: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { username, password, captcha, rememberMe, verificationNo });
  }
}




export interface Captcha {
  captcha: string;
  sitekey: string;
  input: string;
}