import {Component, Inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {SysUserService} from "../../../@core/service/authorization/sysUser.service";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzUploadModule} from "ng-zorro-antd/upload";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NZ_MODAL_DATA, NzModalRef} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-sys-user-import',
  standalone: true,
  imports: [CommonModule, NzFormModule, NzIconModule, NzUploadModule, NzButtonModule],
  templateUrl: './sys-user-import.component.html',
  styleUrls: ['./sys-user-import.component.scss']
})
export class SysUserImportComponent implements OnInit {
  urlDownloadFileImport: string = '';
  file: any;
  constructor(
    private _sysUserService: SysUserService,
    private _modalRef: NzModalRef,
    @Inject(NZ_MODAL_DATA) public data: any,
  ) {
  }
  ngOnInit(): void {
    this.urlDownloadFileImport = this._sysUserService.createUrl();
  }

  handleChange(event: any) {
    this.file = event.target.files[0];
  }

  import() {
    const formData = new FormData();
    if (this.file) {
      formData.append("fileImport", this.file);
    }
    this._sysUserService.import(formData).subscribe(
      res => {
        this._modalRef.close();
        this.data.close();
      }
    )
  }
}
