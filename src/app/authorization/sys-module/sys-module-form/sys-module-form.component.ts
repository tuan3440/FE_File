import {Component, Inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzFormModule} from "ng-zorro-antd/form";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NZ_MODAL_DATA, NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {SysModuleTreeComponent} from "../sys-module-tree/sys-module-tree.component";
import {CommonUtils} from "../../../@core/service/common-utils.service";
import {SysModule} from "../../../@core/model/authorization/sysModule.model";
import {SysModuleService} from "../../../@core/service/authorization/sysModule.service";
import {NzNotificationService} from "ng-zorro-antd/notification";

@Component({
  selector: 'app-sys-module-form',
  standalone: true,
  imports: [CommonModule, NzFormModule, ReactiveFormsModule, NzInputModule, NzSelectModule, NzButtonModule, NzWaveModule, NzIconModule],
  templateUrl: './sys-module-form.component.html',
  styleUrls: ['./sys-module-form.component.scss'],
  providers: [
    NzModalService
  ]
})
export class SysModuleFormComponent implements OnInit{
  formGroup: FormGroup = new FormGroup<any>({
    id: new FormControl(null),
    code: new FormControl("", [Validators.required]),
    name: new FormControl("", [Validators.required]),
    parentId: new FormControl(-1),
    pathUrl: new FormControl(""),
    position: new FormControl(""),
    icon: new FormControl(""),
    status: new FormControl(1),
    description: new FormControl("")
  })

  ngOnInit() {
    if (this.data['module']) {
      this.mode = 'edit';
    }
    this.initForm();
  }

  constructor(
    private _modalService: NzModalService,
    private _sysModuleService: SysModuleService,
    private _notify: NzNotificationService,
    private _modalRef: NzModalRef,
    @Inject(NZ_MODAL_DATA) public data: any
  ) {
  }

  mode: string = 'create';
  modules: any[] = [];
  closePopup() {
    this._modalRef.close();
  }

  save() {
    if (CommonUtils.isValidForm(this.formGroup)) {
      let module: SysModule = {
        id: this.formGroup.controls['id'].value,
        name: this.formGroup.controls['name'].value,
        code: this.formGroup.controls['code'].value,
        parentId: this.formGroup.controls['parentId'].value,
        pathUrl: this.formGroup.controls['pathUrl'].value,
        icon: this.formGroup.controls['icon'].value,
        description: this.formGroup.controls['description'].value,
        status: this.formGroup.controls['status'].value,
        position: this.formGroup.controls['position'].value
      }
      if (this.mode == 'edit') {
        this._sysModuleService.update(module).subscribe(
          res => {
            this._notify.success('','Cập nhật module thành công');
            this.data.close();
            this._modalRef.close();
          },
          error => {

          }
        )
      } else {
        this._sysModuleService.create(module).subscribe(
          res => {
            this._notify.success('','Tạo mới vai trò thành công');
            this.data.close();
            this._modalRef.close();
          },
          error => {

          }
        )
      }
    }
  }

  openTreeModule() {
    let ref = this._modalService.create({
      nzTitle: 'Chọn module cha',
      nzContent: SysModuleTreeComponent,
      nzWidth: '40vw',
      nzFooter: null,
      nzData: {
        close: () => {

        }
      }
    })
    ref.afterClose.subscribe(
      res => {
        this.modules.push({
          title: res.title,
          value: parseInt(res.key)
        });
        this.formGroup.controls['parentId'].setValue(parseInt(res.key));
      }
    )
  }

  private initForm() {
    this.formGroup.setValue(this.data['module']);
    if (this.data['module'].parentId != -1) {
      this._sysModuleService.viewDetial(this.data['module'].parentId).subscribe(
        res => {
          let parentName = res.body.name;
          this.modules.push({
            title: parentName,
            value: this.data['module'].parentId
          });
        }, error => {

        }
      )
    }
  }
}
