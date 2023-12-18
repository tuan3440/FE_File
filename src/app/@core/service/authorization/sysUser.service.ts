import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
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
}
