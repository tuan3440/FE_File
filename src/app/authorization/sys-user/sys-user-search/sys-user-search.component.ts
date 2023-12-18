import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {SysUser} from "../../../@core/model/authorization/sysUser.model";
import {SysRoleService} from "../../../@core/service/authorization/sysRole.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {SysUserService} from "../../../@core/service/authorization/sysUser.service";
import {SysUserRoleComponent} from "../sys-user-role/sys-user-role.component";
import {CommonUtils} from "../../../@core/service/common-utils.service";

@Component({
  selector: 'app-sys-user-search',
  standalone: true,
    imports: [CommonModule, FormsModule, NzButtonModule, NzCardModule, NzGridModule, NzIconModule, NzInputModule, NzSelectModule, NzTableModule, NzWaveModule],
  templateUrl: './sys-user-search.component.html',
  styleUrls: ['./sys-user-search.component.scss'],
  providers: [
    NzModalService,
    NzNotificationService
  ]
})
export class SysUserSearchComponent implements OnInit {
  keyword: string = '';
  status: number = -1;
  users: SysUser[] = []
  page: any = {
    total: 0,
    page: 1,
    size: 10,
    sort: ''
  }
  constructor(
    private _sysRoleService: SysRoleService,
    private _modalService: NzModalService,
    private _notify: NzNotificationService,
    private _sysUserService: SysUserService
  ) {
  }

  ngOnInit() {
    this.search();
  }

  search() {
    this._sysUserService.searchUsers(
      {
        keyword: this.keyword,
        status: this.status
      },
      {
        page: this.page.page - 1,
        size: this.page.size,
        sort: this.page.sort
      }
    ).subscribe(
      res => {
        this.page.total = Number(res.headers.get("X-Total-Count"));
        this.users = res.body;
      }, error => {

      }
    )
  }



  edit(data: SysUser) {

  }

  delete(id: number | undefined) {

  }

  onCurrentPageDataChange(event: any) {
    console.log(event)
    this.page.page = event;
    this.search()
  }

  config(id: number | undefined) {
    this._modalService.create({
      nzTitle: 'Cấu hình vai trò cho user',
      nzContent: SysUserRoleComponent,
      nzWidth: '60vw',
      nzFooter: null,
      nzData: {
        userId: id,
        close: () => {

        }
      }
    })
  }

  checkVisible(action: string) {
    return CommonUtils.hasPermission('MANAGE_USER', action);
  }

  openDialog() {

  }
}
