import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {createRequestOption} from "../../utils/request-util";
import {environment} from "../../../../environments/enviroment";

@Injectable({providedIn: 'root'})
export class SysActionService {
  constructor(private http: HttpClient) {
  }

  searchAction(body: any, req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.post<any>(`${environment.serverUrl.apiUrl}/admin/action/doSearch`, body, {
      params: options,
      observe: "response",
    });
  }

  create(body: any): Observable<any> {
    return this.http.post<any>(`${environment.serverUrl.apiUrl}/admin/action/insert`, body, {
      observe: "response",
    });
  }

  update(body: any): Observable<any> {
    return this.http.post<any>(`${environment.serverUrl.apiUrl}/admin/action/update`, body, {
      observe: "response",
    });
  }

  delete(id: number): Observable<any> {
    return this.http.post<any>(`${environment.serverUrl.apiUrl}/admin/action/delete/` +  id, {}, {
      observe: "response",
    });
  }
}
