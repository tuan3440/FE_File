import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../../environments/enviroment";
import {AppStorage} from "../../AppStorage";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(protected http: HttpClient) { }

  public register(data: any): Observable<any> {
    return this.http.post(`${environment.serverUrl.apiUrl}/register`, data, {observe: 'response'})
  }

  public login(data: any): Observable<any> {
    return this.http.post(`${environment.serverUrl.apiUrl}/authenticate`, data, {observe: 'response'})
  }

  public getCaptchaCode(): Observable<any> {
    return this.http.get(`${environment.serverUrl.apiUrl}/get-captcha-code`, {observe: 'body', responseType: 'text'});
  }

  public getCaptchaImg(data: string): Observable<any> {
    return this.http.post(`${environment.serverUrl.apiUrl}/get-captcha-img`, {"key": data});
  }

  public getOtp(data: any) {
    return this.http.post(`${environment.serverUrl.apiUrl}/getOtp`, data);
  }

  public verifyOtp(data: any):Observable<any> {
    return this.http.post(`${environment.serverUrl.apiUrl}/verify-otp`, data);
  }

  public logout(): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + AppStorage.getUserToken().access_token });
    let options = { headers: headers };
    return this.http.post(`${environment.serverUrl.apiUrl}/logout`, {}, {headers: headers})
  }

  changeForgotPass(data: any): Observable<any> {
    return this.http.post(`${environment.serverUrl.apiUrl}/change-password-forget`, data);
  }
}
