import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/enviroment";

@Injectable({providedIn: 'root'})
export class SysRoleModuleService {
    constructor(private http: HttpClient) {
    }

    update(roleId: number, body: any): Observable<any> {
        return this.http.post<any>(`${environment.serverUrl.apiUrl}/admin/roleModule/update/` + roleId, body, {
            observe: "response",
        });
    }
}
