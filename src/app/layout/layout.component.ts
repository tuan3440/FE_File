import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {NzBreadCrumbModule} from "ng-zorro-antd/breadcrumb";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzMenuModule} from "ng-zorro-antd/menu";
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {AppStorage} from "../@core/service/AppStorage";
import {AuthService} from "../@core/service/auth/auth/auth.service";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NzButtonModule} from "ng-zorro-antd/button";
import { jwtDecode } from "jwt-decode";
import {SysModuleService} from "../@core/service/authorization/sysModule.service";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, NzLayoutModule, NzBreadCrumbModule, NzIconModule, NzMenuModule, NzGridModule, RouterOutlet, NzToolTipModule, NzButtonModule, RouterLink],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LayoutComponent implements OnInit{
  isCollapsed = false;
  menus: any[] = [];
  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _sysModuleService: SysModuleService
  ) {
  }

  ngOnInit() {
    let user = AppStorage.getUserToken();
    let jwt = user.access_token;
    let infoJwt: any = jwtDecode(jwt);
    let userId = infoJwt.userId;
    let menu: any[];
    this._sysModuleService.getModuleByUserId(userId).subscribe(
      res => {
        AppStorage.set('module', JSON.stringify(res.body));
        if (res) {
          menu = this.formatListModule(res.body, -1);
          this.menus = menu;
        }
      },
      error => {

      }
    )
  }

  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    this._authService.logout().subscribe(() => {})
    AppStorage.clear();
    this._router.navigate(['auth/login'])
  }

  private formatListModule(data: any, parentId: number) {
    const arr = [];
    for (let i = 0; i < data.length; i++) {
      const dataItem = data[i];
      if (dataItem.parentId === parentId) {
        const children = this.formatListModule(data, dataItem.id);
        if (children.length > 0) {
          dataItem.link = null;
          dataItem.children = children;
        } else {
          dataItem.children = []
        }
        arr.push(dataItem);
      }
    }
    return arr;
  }

  convertUrl(pathUrl: any) {
    let url = '[' + '\'' + pathUrl + '\'' + ']';
    return url;
  }
}
