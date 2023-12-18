import {Component, Inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzFormModule} from "ng-zorro-antd/form";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NZ_MODAL_DATA, NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {CommonUtils} from "../../../@core/service/common-utils.service";
import {SysRole} from "../../../@core/model/authorization/sysRole.model";
import {SysRoleService} from "../../../@core/service/authorization/sysRole.service";
import {NzNotificationService} from "ng-zorro-antd/notification";

@Component({
  selector: 'app-sys-role-form',
  standalone: true,
  imports: [CommonModule, NzFormModule, ReactiveFormsModule, NzInputModule, NzSelectModule, NzButtonModule],
  templateUrl: './sys-role-form.component.html',
  styleUrls: ['./sys-role-form.component.scss'],
  providers: [
    NzNotificationService
  ]
})
export class SysRoleFormComponent implements OnInit {
  formGroup: FormGroup = new FormGroup<any>({
    id: new FormControl(""),
    name: new FormControl("", [Validators.required]),
    code: new FormControl("", [Validators.required]),
    description: new FormControl(""),
    status: new FormControl(1)
  })
  mode: string = 'create';

  constructor(
    private _modalRef: NzModalRef,
    private _sysRoleService: SysRoleService,
    private _notify: NzNotificationService,
    @Inject(NZ_MODAL_DATA) public data: any
  ) {
  }


  ngOnInit(): void {
    if (this.data['role']) {
      this.mode = 'edit';
    }
    this.initForm();
  }

  closePopup() {
    this._modalRef.close();
  }

  save() {
    if (CommonUtils.isValidForm(this.formGroup)) {
      let sysRole: SysRole = {
        id: this.formGroup.controls['id'].value,
        code: this.formGroup.controls['code'].value,
        name: this.formGroup.controls['name'].value,
        description: this.formGroup.controls['description'].value,
        status: this.formGroup.controls['status'].value
      };

      if (this.mode == 'edit') {
        this._sysRoleService.update(sysRole).subscribe(
          res => {
            this._notify.success('','Sửa vai trò thành công');
            this.data.close();
            this._modalRef.close();
          }, error => {

          }
        )
      } else {
        this._sysRoleService.create(sysRole).subscribe(
          res => {
            this._notify.success('','Tạo mới vai trò thành công');
            this.data.close();
            this._modalRef.close();
          },
          error => {
            this._notify.error('','Tạo mới vai trò thất bại');
          }
        )
      }
    }
  }

  private initForm() {
    this.formGroup.setValue(this.data['role']);
  }
}
