import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/enviroment";
import {AppStorage} from "../AppStorage";
import {createRequestOption} from "../../utils/request-util";
@Injectable({providedIn: 'root'})
export class SysRoleService {
    constructor(private http: HttpClient) {
    }

    searchRoles(body: any, req?: any): Observable<any> {
      const options = createRequestOption(req);
      return this.http.post<any>(`${environment.serverUrl.apiUrl}/admin/role/doSearch`, body, {
          params: options,
          observe: "response",
      });
    }

    create(body: any): Observable<any> {
      return this.http.post<any>(`${environment.serverUrl.apiUrl}/admin/role/insert`, body, {
        observe: "response",
      });
    }

  update(body: any): Observable<any> {
    return this.http.post<any>(`${environment.serverUrl.apiUrl}/admin/role/update`, body, {
      observe: "response",
    });
  }

  delete(id: number): Observable<any> {
    return this.http.post<any>(`${environment.serverUrl.apiUrl}/admin/role/delete/` +  id, {}, {
      observe: "response",
    });
  }

}
