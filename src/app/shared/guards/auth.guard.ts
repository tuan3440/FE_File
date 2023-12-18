import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {AppStorage} from "../../@core/service/AppStorage";

@Injectable(
  {
    providedIn: 'root'
  }
)
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router
    ) {}

    canActivate (next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
            const userToken = AppStorage.getUserToken();
            if (!userToken) {
              this.router.navigate(['/auth/login']);
              return false;
            }
            // check role by module
            if (state.url == '/pages') {
              return true;
            }
      const module = JSON.parse(AppStorage.get('module'));

      let a: any[] = module.filter((m: { pathUrl: string; }) => m.pathUrl === state.url);
            if (a.length == 0) {
              this.router.navigate(['/pages']);
              return false;
            }
            return true;
    }

}
