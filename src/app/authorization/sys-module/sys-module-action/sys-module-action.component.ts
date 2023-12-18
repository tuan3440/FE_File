import {Component, Inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzFormModule} from "ng-zorro-antd/form";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NZ_MODAL_DATA, NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {SysActionService} from "../../../@core/service/authorization/sysAction.service";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {SysModuleActionService} from "../../../@core/service/authorization/sysModuleAction.service";
import {NzNotificationService} from "ng-zorro-antd/notification";

@Component({
  selector: 'app-sys-module-action',
  standalone: true,
  imports: [CommonModule, NzFormModule, ReactiveFormsModule, NzSelectModule, NzButtonModule, NzWaveModule],
  templateUrl: './sys-module-action.component.html',
  styleUrls: ['./sys-module-action.component.scss'],
  providers: [
    NzModalService,
    NzNotificationService
  ]
})
export class SysModuleActionComponent implements OnInit {
  formGroup: FormGroup =  new FormGroup({
    actionIds: new FormControl([]),
    moduleId: new FormControl("")
  })
  actionList: any[] = [];

  constructor(
    private _modalRef: NzModalRef,
    private _sysActionService: SysActionService,
    private _sysModuleActionSevice: SysModuleActionService,
    private _notify: NzNotificationService,
    @Inject(NZ_MODAL_DATA) public data: any
  ) {
  }
  ngOnInit(): void {
    this.formGroup.controls['moduleId'].setValue(this.data.moduleId);
    this._sysActionService.searchAction({}, null).subscribe(
      res => {
        this.actionList = res.body.map((item: { id: any; name: any; }) =>
          ({
            id: item.id,
            name: item.name
          })
        );
      }, error => {

      }
    )

    this._sysModuleActionSevice.getByModuleId(this.data.moduleId).subscribe(
      res => {
        let actionIds: any[] = res.body.map((item: { actionId: any; }) => item.actionId);
        this.formGroup.controls['actionIds'].setValue(actionIds);
      }
    )


  }

  closePopup() {
    this._modalRef.close();
  }

  save() {
    this._sysModuleActionSevice.update(this.formGroup.value).subscribe(
      res => {
        this._notify.success('','Update thành công');
        this._modalRef.close();
      }, error => {

      }
    )
  }
}
