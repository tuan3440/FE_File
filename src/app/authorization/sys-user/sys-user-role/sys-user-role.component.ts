import {Component, Inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {NZ_MODAL_DATA, NzModalRef} from "ng-zorro-antd/modal";
import {SysRoleService} from "../../../@core/service/authorization/sysRole.service";
import {SysUserRoleService} from "../../../@core/service/authorization/sysUserRole.service";
import {NzNotificationService} from "ng-zorro-antd/notification";

@Component({
  selector: 'app-sys-user-role',
  standalone: true,
  imports: [CommonModule, FormsModule, NzButtonModule, NzFormModule, NzGridModule, NzSelectModule, NzWaveModule, ReactiveFormsModule],
  templateUrl: './sys-user-role.component.html',
  styleUrls: ['./sys-user-role.component.scss'],
  providers: [
    NzNotificationService
  ]
})
export class SysUserRoleComponent implements OnInit{
  formGroup: FormGroup = new FormGroup<any>({
    roleId: new FormControl(""),
    userId: new FormControl("")
  })
  roleList: any[] = [];

  constructor(
    private _modalRef: NzModalRef,
    private _sysRoleService: SysRoleService,
    private _sysUserRoleService: SysUserRoleService,
    @Inject(NZ_MODAL_DATA) public data: any,
    private _notify: NzNotificationService
  ) {
  }

  ngOnInit(): void {
    this.formGroup.controls['userId'].setValue(this.data.userId);
    this._sysRoleService.searchRoles({
      keyword: null,
      status: 1
    }, null).subscribe(
      res => {
        this.roleList = res.body.map((role: { id: any; name: any; }) => ({id: role.id, name: role.name}))
      }, error => {

      }
    )

    this._sysUserRoleService.getRoleByUserId(this.data.userId).subscribe(
      res => {
        if (res.body) {
          this.formGroup.controls['roleId'].setValue(res.body.roleId);
        }
      }, error => {

      }
    )


  }
  closePopup() {
    this._modalRef.close();
  }

  save() {
    this._sysUserRoleService.update(this.formGroup.value).subscribe(
      res => {
        this._notify.success('','Update thành công');
        this._modalRef.close();
      }, error => {

      }
    )
  }


}
