import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {createRequestOption} from "../../utils/request-util";
import {environment} from "../../../../environments/enviroment";

@Injectable({providedIn: 'root'})
export class SysModuleService {
  constructor(private http: HttpClient) {
  }

  searchModule(body: any, req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.post<any>(`${environment.serverUrl.apiUrl}/admin/module/doSearch`, body, {
      params: options,
      observe: "response",
    });
  }

  create(body: any): Observable<any> {
    return this.http.post<any>(`${environment.serverUrl.apiUrl}/admin/module/insert`, body, {
      observe: "response",
    });
  }

  update(body: any): Observable<any> {
    return this.http.post<any>(`${environment.serverUrl.apiUrl}/admin/module/update`, body, {
      observe: "response",
    });
  }

  viewDetial(id: any): Observable<any> {
    return this.http.get<any>(
      `${environment.serverUrl.apiUrl}/admin/module/viewDetail/` + id,
      {
        observe: "response",
      }
    );
  }

  delete(id: number): Observable<any> {
    return this.http.post<any>(`${environment.serverUrl.apiUrl}/admin/module/delete/` + id, {}, {
      observe: "response",
    });
  }

  openTreeModule(): Observable<any> {
    return this.http.post<any>(`${environment.serverUrl.apiUrl}/admin/module/openTree`, {}, {
      observe: "response",
    });
  }

  getModuleByUserId(userId: number): Observable<any> {
    return this.http.post<any>(`${environment.serverUrl.apiUrl}/admin/module/getMenu`, userId, {
      observe: "response",
    });
  }
}
