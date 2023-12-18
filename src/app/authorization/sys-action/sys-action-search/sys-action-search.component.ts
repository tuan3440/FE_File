import { Component } from '@angular/core';
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
import {SysAction} from "../../../@core/model/authorization/sysAction.model";
import {SysActionService} from "../../../@core/service/authorization/sysAction.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {SysActionFormComponent} from "../sys-action-form/sys-action-form.component";
import {SysRole} from "../../../@core/model/authorization/sysRole.model";
import {CommonUtils} from "../../../@core/service/common-utils.service";

@Component({
  selector: 'app-sys-action-search',
  standalone: true,
  imports: [CommonModule, FormsModule, NzButtonModule, NzCardModule, NzGridModule, NzIconModule, NzInputModule, NzSelectModule, NzTableModule, NzWaveModule],
  templateUrl: './sys-action-search.component.html',
  styleUrls: ['./sys-action-search.component.scss'],
  providers: [
    NzModalService,
    NzNotificationService
  ]
})
export class SysActionSearchComponent {
  keyword: string = '';
  status: number = -1;
  actions: SysAction[] = []
  page: any = {
    total: 0,
    page: 1,
    size: 10,
    sort: ''
  }
  constructor(
    private _sysActionService: SysActionService,
    private _modalService: NzModalService,
    private _notify: NzNotificationService,
  ) {
  }

  ngOnInit() {
    this.search();
    // CommonUtils.hasPermission('MANAGE_ACTION', 'CREATE')
  }

  search() {
    this._sysActionService.searchAction(
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
        this.actions = res.body;
      }, error => {

      }
    )
  }

  openDialog() {
    this._modalService.create({
      nzTitle: 'Thêm mới hành động',
      nzContent: SysActionFormComponent,
      nzWidth: '60vw',
      nzFooter: null,
      nzData: {
        close: () => {
          this.search();
        }
      }
    })
  }

  edit(data: SysRole) {
    this._modalService.create({
      nzTitle: 'Sửa hành động',
      nzContent: SysActionFormComponent,
      nzWidth: '60vw',
      nzFooter: null,
      nzData: {
        action: data,
        close: () => {
          this.search();
        }
      }
    })
  }

  delete(id: number | undefined) {
    if (id) {
      this._modalService.confirm({
        nzTitle: '<i>Bạn có muốn xóa hành động này ?</i>',
        nzContent: '',
        nzOnOk: () => {
          this._sysActionService.delete(id).subscribe(
            res => {
              this._notify.success('','xóa thành công');
              this.search();
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

  checkVisible(action: string) {
    return CommonUtils.hasPermission('MANAGE_ACTION', action);
  }
}
