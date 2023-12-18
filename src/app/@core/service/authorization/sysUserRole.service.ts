import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/enviroment";

@Injectable({providedIn: 'root'})
export class SysUserRoleService {
  constructor(private http: HttpClient) {
  }

  getRoleByUserId(id: any): Observable<any> {
    return this.http.get<any>(
      `${environment.serverUrl.apiUrl}/admin/userRole/getRoleByUserId/` + id,
      {
        observe: "response",
      }
    );
  }
  update(body: any): Observable<any> {
    return this.http.post<any>(`${environment.serverUrl.apiUrl}/admin/userRole/insert`, body, {
      observe: "response",
    });
  }
}
