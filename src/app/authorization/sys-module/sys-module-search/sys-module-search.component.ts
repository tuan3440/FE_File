import {Component, OnInit, ViewChild} from '@angular/core';
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
import {SysModuleSidebarComponent} from "../sys-module-sidebar/sys-module-sidebar.component";
import {SysModule} from "../../../@core/model/authorization/sysModule.model";
import {SysModuleService} from "../../../@core/service/authorization/sysModule.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {SysModuleFormComponent} from "../sys-module-form/sys-module-form.component";
import {SysRole} from "../../../@core/model/authorization/sysRole.model";
import {SysModuleActionComponent} from "../sys-module-action/sys-module-action.component";
import {CommonUtils} from "../../../@core/service/common-utils.service";

@Component({
  selector: 'app-sys-module-search',
  standalone: true,
    imports: [CommonModule, FormsModule, NzButtonModule, NzCardModule, NzGridModule, NzIconModule, NzInputModule, NzSelectModule, NzTableModule, NzWaveModule, SysModuleSidebarComponent],
  templateUrl: './sys-module-search.component.html',
  styleUrls: ['./sys-module-search.component.scss'],
  providers: [
    NzModalService,
    NzNotificationService
  ]
})
export class SysModuleSearchComponent implements OnInit {
  keyword: string = '';
  status: number = -1;
  parentId: number = -1;
  page: any = {
    total: 0,
    page: 1,
    size: 10,
    sort: ''
  }
  modules: SysModule[] = [];
  @ViewChild('moduleSidebar') moduleSidebar: SysModuleSidebarComponent | undefined;
  constructor(
    private _sysModuleService: SysModuleService,
    private _modalService: NzModalService,
    private _notify: NzNotificationService,
  ) {
  }

  ngOnInit() {
    this.search();
  }

  search() {
    this._sysModuleService.searchModule(
      {
        keyword: this.keyword,
        status: this.status,
        parentId: this.parentId
      },
      {
        page: this.page.page - 1,
        size: this.page.size,
        sort: this.page.sort
      }
    ).subscribe(
      res => {
        this.page.total = Number(res.headers.get("X-Total-Count"));
        this.modules = res.body;
      }, error => {

      }
    )
  }

  openDialog() {
    this._modalService.create({
      nzTitle: 'Thêm mới module',
      nzContent: SysModuleFormComponent,
      nzWidth: '60vw',
      nzFooter: null,
      nzData: {
        close: () => {
          this.search();
          if (this.moduleSidebar) this.moduleSidebar.openTree();
        }
      }
    })
  }

  edit(data: SysRole) {
    this._modalService.create({
      nzTitle: 'Thêm mới vai trò',
      nzContent: SysModuleFormComponent,
      nzWidth: '60vw',
      nzFooter: null,
      nzData: {
        module: data,
        close: () => {
          this.search();
        }
      }
    })
  }

  delete(id: number | undefined) {
    if (id) {
      this._modalService.confirm({
        nzTitle: '<i>Bạn có muốn xóa module này ?</i>',
        nzContent: '',
        nzOnOk: () => {
          this._sysModuleService.delete(id).subscribe(
            res => {
              this._notify.success('','xóa thành công');
              this.search();
              if (this.moduleSidebar) this.moduleSidebar.openTree();
            },
            error => {
              this._notify.error('',' xóa thất bại');
            }
          )
        }
      });
    }
  }

  onCurrentPageDataChange(event: any) {
    this.page.page = event;
    this.search()
  }

  onChange(parentId: any) {
    this.parentId = parentId;
    this.search()
  }

  config(id: number | undefined) {
    this._modalService.create({
      nzTitle: 'Câu hình module theo action',
      nzContent: SysModuleActionComponent,
      nzWidth: '60vw',
      nzFooter: null,
      nzData: {
        moduleId: id,
        close: () => {

        }
      }
    })
  }

  checkVisible(action: string) {
    return CommonUtils.hasPermission('MANAGE_MODULE', action);
  }
}
