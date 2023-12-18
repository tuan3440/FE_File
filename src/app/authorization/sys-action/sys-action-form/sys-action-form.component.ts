import {Component, Inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NZ_MODAL_DATA, NzModalRef} from "ng-zorro-antd/modal";
import {SysRoleService} from "../../../@core/service/authorization/sysRole.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {CommonUtils} from "../../../@core/service/common-utils.service";
import {SysRole} from "../../../@core/model/authorization/sysRole.model";
import {SysActionService} from "../../../@core/service/authorization/sysAction.service";
import {SysAction} from "../../../@core/model/authorization/sysAction.model";

@Component({
  selector: 'app-sys-action-form',
  standalone: true,
    imports: [CommonModule, NzButtonModule, NzFormModule, NzGridModule, NzInputModule, NzSelectModule, NzWaveModule, ReactiveFormsModule],
  templateUrl: './sys-action-form.component.html',
  styleUrls: ['./sys-action-form.component.scss'],
  providers: [
    NzNotificationService
  ]
})
export class SysActionFormComponent {
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
    private _sysActionService: SysActionService,
    private _notify: NzNotificationService,
    @Inject(NZ_MODAL_DATA) public data: any
  ) {
  }


  ngOnInit(): void {
    if (this.data['action']) {
      this.mode = 'edit';
    }
    this.initForm();
  }

  closePopup() {
    this._modalRef.close();
  }

  save() {
    if (CommonUtils.isValidForm(this.formGroup)) {
      let sysAction: SysAction = {
        id: this.formGroup.controls['id'].value,
        code: this.formGroup.controls['code'].value,
        name: this.formGroup.controls['name'].value,
        description: this.formGroup.controls['description'].value,
        status: this.formGroup.controls['status'].value
      };

      if (this.mode == 'edit') {
        this._sysActionService.update(sysAction).subscribe(
          res => {
            this._notify.success('','Sửa hành động thành công');
            this.data.close();
            this._modalRef.close();
          }, error => {

          }
        )
      } else {
        this._sysActionService.create(sysAction).subscribe(
          res => {
            this._notify.success('','Tạo mới hành động thành công');
            this.data.close();
            this._modalRef.close();
          },
          error => {
            this._notify.error('','Tạo mới hành động thất bại');
          }
        )
      }
    }
  }

  private initForm() {
    this.formGroup.setValue(this.data['action']);
  }
}
