import {Component, HostListener, Inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzFormModule} from "ng-zorro-antd/form";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzUploadFile, NzUploadModule} from "ng-zorro-antd/upload";
import {NZ_MODAL_DATA, NzModalModule, NzModalRef} from "ng-zorro-antd/modal";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {CommonUtils} from "../../../@core/service/common-utils.service";
import {SysUserService} from "../../../@core/service/authorization/sysUser.service";
import {SysUser} from "../../../@core/model/authorization/sysUser.model";
import {FileAttachmentService} from "../../../@core/service/fileAttachment/fileAttachment.service";
import {AmazonS3Service} from "../../../@core/service/fileAttachment/amazonS3.service";

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve: any, reject: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

@Component({
  selector: 'app-sys-user-create',
  standalone: true,
  imports: [CommonModule, NzFormModule, ReactiveFormsModule, NzInputModule, NzRadioModule, NzDatePickerModule, NzSelectModule, NzUploadModule, NzModalModule, NzIconModule, NzButtonModule, NzWaveModule],
  templateUrl: './sys-user-create.component.html',
  styleUrls: ['./sys-user-create.component.scss']
})
export class SysUserCreateComponent implements OnInit {
  mode: string = 'create';
  formGroup: FormGroup = new FormGroup<any>({
    userName: new FormControl("", [Validators.required]),
    fullName: new FormControl(""),
    email: new FormControl("", [Validators.required, Validators.email]),
    cellphone: new FormControl(""),
    gender: new FormControl(1),
    dateOfBirth: new FormControl(""),
    status: new FormControl(1)
  })
  imgAsset: any;
  imgAssetRaw: any;
  imgAssetDel: any;
  previewImage: string | undefined = '';
  previewVisible = false;
  fileList: NzUploadFile[] = [];
  sysUser: SysUser = {};
  handlePreview = async (file: NzUploadFile): Promise<void> => {
    this.imgAssetRaw = file;
    console.log(file)
    if (!file.url && !file['preview']) {
      file['preview'] = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
  };

  closePopup() {
    this._modalRef.close();
  }

  save() {
    if (CommonUtils.isValidForm(this.formGroup)) {
      const formData = new FormData();
      if (this.imgAssetRaw) {
        formData.append("imgAsset", this.imgAssetRaw);
      }
      if (this.imgAssetDel) {
        formData.append("imgAssetDel", this.imgAssetDel);
      }
      formData.append("userDTOString", JSON.stringify(this.formGroup.value));
      if (this.mode == 'create') {
        this._sysUserService.create(formData).subscribe(
          res => {
            this.data.close();
            this._modalRef.close();
          }
        )
      } else {
        this._sysUserService.update(formData).subscribe(
          res => {
            this.data.close();
            this._modalRef.close();
          }
        )
      }


    }
  }

  ngOnInit(): void {
    if (this.data['user']) {
      this.mode = 'edit';
      this.sysUser = this.data['user'];
    }
    this.initForm();
  }

  constructor(
    private _modalRef: NzModalRef,
    private _sysUserService: SysUserService,
    private _fileAttachmentService: FileAttachmentService,
    @Inject(NZ_MODAL_DATA) public data: any,
    private _amazonS3Service: AmazonS3Service
  ) {
  }

  private initForm() {
    if (this.sysUser.id) {
      this.formGroup.addControl('id', new FormControl(this.sysUser.id));
      this.formGroup.controls['userName'].setValue(this.sysUser.userName);
      this.formGroup.controls['fullName'].setValue(this.sysUser.fullName);
      this.formGroup.controls['email'].setValue(this.sysUser.email);
      this.formGroup.controls['cellphone'].setValue(this.sysUser.cellphone);
      this.formGroup.controls['gender'].setValue(this.sysUser.gender);
      this.formGroup.controls['dateOfBirth'].setValue(this.sysUser.dateOfBirth);
      this.formGroup.controls['status'].setValue(this.sysUser.status);

      // get avatar
      // this._fileAttachmentService.searchFiles(
      //   {
      //     fileType: 1,
      //     objectId: this.sysUser.id
      //   }
      // ).subscribe(
      //   res => {
      //     console.log(res.body)
      //     this.imgAsset = {
      //       src : this._sysUserService.createImageSrc('/file-managements/view?id=' + res.body[0].id),
      //       url : this._sysUserService.createImageSrc('/file-managements/download?id=' +  res.body[0].id),
      //       id : res.body[0].id
      //     }
      //     console.log(this.imgAsset);
      //   },
      //   error => {}
      // )
      if (!CommonUtils.isNullOrEmpty(this.sysUser.imageUrl)) {
        console.log(this.sysUser.imageUrl);
        this.imgAsset = {
          src : this._amazonS3Service.createUrlFile(this.sysUser.imageUrl)
        }
      }

    }

    // console.log(this.imgAsset.src)
  }

  delImg(id: number) {
    this.imgAsset = null;
    // this.imgAssetDel = id;
  }

  imgChange(event: any) {
    let file = event.target.files[0];
    console.log(event.target.files[0])
    const fr = new FileReader();
    fr.onload = evt => {
      const fileModel = new FileModel(evt.target?.result, file.name, file.type.substring(6, file.type.length));
      this.imgAsset = fileModel;
      this.imgAssetRaw = file;
      console.log('aa', this.imgAssetRaw)
    };
    fr.readAsDataURL(file);
    event.target.value = '';
  }

  @HostListener("dragover", ["$event"]) onDragOver(event: any) {
    event.preventDefault();
  }

  @HostListener("dragenter", ["$event"]) onDragEnter(event: any) {
    event.preventDefault();
  }

  @HostListener("dragend", ["$event"]) onDragEnd(event: any) {
    event.preventDefault();
  }

  @HostListener("dragleave", ["$event"]) onDragLeave(event: any) {

    event.preventDefault();
  }

  @HostListener("drop", ["$event"]) onDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files) {
      const files: FileList = event.dataTransfer.files;
      this.saveFiles(files, event.target.id);
    }
  }

  saveFiles(files: FileList, elementID: string) {
    for (let i = 0; i < files.length; i++) {
      const fr = new FileReader();
      fr.onload = evt => {
        this.imgAsset= new FileModel(evt.target?.result, files[i].name, files[i].type.substring(6, files[i].type.length));
        this.imgAssetRaw = files[i];
      };
      fr.readAsDataURL(files[i]);
    }
  }
}

export class FileModel {
  constructor(public src: any, public name: string, public ext: string, public fileId: any = null, public url: any = null,
              public indexInRawArray?: number // index in imgAssetRaw, use when delete
  ) {
  }
}
