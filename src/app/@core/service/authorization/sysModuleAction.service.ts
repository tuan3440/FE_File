import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/enviroment";

@Injectable({providedIn: 'root'})
export class SysModuleActionService {
  constructor(private http: HttpClient) {
  }

  getByModuleId(id: any): Observable<any> {
    return this.http.get<any>(
      `${environment.serverUrl.apiUrl}/admin/moduleAction/getByModuleId/` + id,
      {
        observe: "response",
      }
    );
  }
  update(body: any): Observable<any> {
    return this.http.post<any>(`${environment.serverUrl.apiUrl}/admin/moduleAction/update`, body, {
      observe: "response",
    });
  }

  getActionByModuleCode(code: any): Observable<any> {
    return this.http.get<any>(
      `${environment.serverUrl.apiUrl}/admin/moduleAction/getActionByModuleCode/` + code,
      {
        observe: "response",
      }
    );
  }

}
