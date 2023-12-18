import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {AppStorage} from "../@core/service/AppStorage";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req) {
      next.handle(req);
    }
    const token = this.getAccessToken();
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        }
      })
    }
    return next.handle(req);
  }

  getAccessToken() {
    const userToken = AppStorage.getUserToken();
    if (userToken == null) {
      return "";
    } else {
      return userToken.access_token;
    }
  }

}
