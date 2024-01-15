import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {createRequestOption} from "../../utils/request-util";
import {environment} from "../../../../environments/enviroment";

@Injectable({providedIn: 'root'})
export class SysUserService {
  constructor(private http: HttpClient) {
  }

  searchUsers(body: any, req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.post<any>(`${environment.serverUrl.apiUrl}/admin/user/doSearch`, body, {
      params: options,
      observe: "response",
    });
  }

  create(body: any): Observable<any> {
    return this.http.post<any>(`${environment.serverUrl.apiUrl}/admin/user/insert`, body, {
      observe: "response",
    });
  }

  update(body: any): Observable<any> {
    return this.http.post<any>(`${environment.serverUrl.apiUrl}/admin/user/update`, body, {
      observe: "response",
    });
  }

  public createImageSrc(urlImages: String) {
    return `${environment.serverUrl.apiUrl}${urlImages}`;
  }

  public export() {
    const httpOptions : Object = {
      headers: new HttpHeaders({
        'Content-Type': 'text/plain; charset=utf-8'
      }),
      responseType: "blob", observe: 'response'
      // responseType: 'text'
    };
    return this.http.get<any>(`${environment.serverUrl.apiUrl}/admin/user/exportWithTemplate`, httpOptions
     );
  }

  createUrl() {
    return `${environment.serverUrl.minio}be-file/template_import/template_import_user.xlsx`;
  }

  public import(body?: any): Observable<any> {
    return this.http.post<any>(`${environment.serverUrl.apiUrl}/admin/user/import-user`, body, {
      observe: 'response'
    });
  }
}
