import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzFormModule} from "ng-zorro-antd/form";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {RouterLink} from "@angular/router";
import {CommonUtils} from "../../@core/service/common-utils.service";
import {AuthService} from "../../@core/service/auth/auth/auth.service";

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, NzFormModule, ReactiveFormsModule, NzInputModule, NzButtonModule, NzIconModule, NzCheckboxModule, RouterLink],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  constructor(
    private _authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.refreshCaptcha();
  }

  forgotForm: FormGroup = new FormGroup<any>({
    email: new FormControl('', [Validators.required, Validators.email]),
    captcha: new FormControl('', [Validators.required])
  });

  otpForm: FormGroup = new FormGroup<any>({
    input1: new FormControl('', Validators.pattern('^[0-9]+$')),
    input2: new FormControl('', Validators.pattern('^[0-9]+$')),
    input3: new FormControl('', Validators.pattern('^[0-9]+$')),
    input4: new FormControl('', Validators.pattern('^[0-9]+$')),
    input5: new FormControl('', Validators.pattern('^[0-9]+$')),
    input6: new FormControl('', Validators.pattern('^[0-9]+$')),
  })
  privateKey: any;
  changePassForm: FormGroup = new FormGroup<any>({
    newPassword: new FormControl('', [Validators.required]),
    confirmPasswordAgain: new FormControl('', [Validators.required]),
  })
  imgCaptcha: any;
  strCaptchar: string = '';
  progress: 'init' | 'verifying' | 'changingPass' | 'done' = 'init'
  numberOTPInput: number = 6;
  otpCode = new Array();
  onInputNumber(event: any, type: string) {
    if (isNaN(Number(event.target.value))) {
      this.otpForm.controls[type].setValue(null);
    }
    this.otpForm.controls[type].setValue(event.target.value.slice(0, 1));
  }

  getPartElement(index: number) {
    return document.getElementById('part' + index);
  }

  onKeyUp(index: number, event: any) {
    const eventCode = event.which || event.keyCode;
    // @ts-ignore
    if (this.getPartElement(index)?.['value'].length === 1) {
      if (index !== this.numberOTPInput) {
        this.getPartElement(index + 1)?.focus();
      }
      //đoạn dưới này comment để vẫn focus vào ô cuối cùng, từ đó thao tác enter để submit được

      // else {
      //   // this.getPartElement(index)?.blur();
      // }
    }
    if (eventCode === 8 && index !== 1) {
      this.getPartElement(index - 1)?.focus();
    }
  }

  onPaste(event: ClipboardEvent){
    event.preventDefault();
    const clipboardData = event.clipboardData;
    const pasteTxt = clipboardData?.getData('text/plain');
    if(pasteTxt) this.setOtpCode(pasteTxt);
  }

  private setOtpCode(value: string, index?: number){
    if(index){
      this.otpCode[index-1] = value;
    }else{
      for (let i = 0; i < value.length; i++) {
        this.otpCode[i] = value.charAt(i);
        if( i === value.length -1){
          this.getPartElement(i)?.focus();
        }
      }
    }

  }

  confirmForget() {
    if (!CommonUtils.isValidForm(this.forgotForm)) {
      return;
    }
    this._authService.getOtp(this.forgotForm.value).subscribe(
      res => {
        if (res) {
          this.progress = 'verifying';
        }
      },
      error => {

      }
    )
  }

  refreshCaptcha() {
    this._authService.getCaptchaCode().subscribe(
      res => {
        this.strCaptchar = res;
        this._authService.getCaptchaImg(this.strCaptchar).subscribe(resp => {
          this.imgCaptcha = resp.imgCaptcha;
        })
      }
    )
  }

  verifyOtp() {
    this._authService.verifyOtp({
      email: this.forgotForm.get('email')!.value,
      code: this.otpCode.join("")
    }).subscribe(
      res => {
        this.progress = 'changingPass';
        this.privateKey = res!.detail!.key;
      }
    )
  }

  changePassword() {
    if (!CommonUtils.isValidForm(this.changePassForm)) {
      return;
    }
    this._authService.changeForgotPass({
      email: this.forgotForm.get('email')!.value,
      newPass: this.changePassForm.get('newPassword')!.value,
      comPass: this.changePassForm.get('confirmPasswordAgain')!.value,
      key: this.privateKey,

    }).subscribe(res => {
      if (res.code === 1) {
        this.progress = 'done';
      }
    })
  }
}
