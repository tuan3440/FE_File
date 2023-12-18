import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzFormModule} from "ng-zorro-antd/form";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzButtonModule} from "ng-zorro-antd/button";
import {Router} from "@angular/router";
import {AuthService} from "../../@core/service/auth/auth/auth.service";
import {CommonUtils} from "../../@core/service/common-utils.service";
import {AppStorage} from "../../@core/service/AppStorage";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, NzFormModule, ReactiveFormsModule, NzInputModule, NzButtonModule, NzIconModule, NzCheckboxModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [
    NzNotificationService
  ]
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup<any>({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(false)
  })

  enableCaptcha: boolean = false;
  strCaptchar: string = '';
  imgCaptcha: any;
  countLoginFail:number = 0;

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _notify: NzNotificationService
  ) {
  }
  submitForm() {
    if (!CommonUtils.isValidForm(this.loginForm)) {
      return;
    }
    const data = this.loginForm.value;
    this._authService.login(data).subscribe(
      res => {
        console.log(res);
        const user: any = {};
        user.access_token = res.body.id_token;
        AppStorage.setUserToken(user);
        this._router.navigate(['/pages']);
      },
      err => {
        this.countLoginFail++;
        if (this.countLoginFail == 3) {
          this.enableCaptcha = true;
          this.loginForm.addControl('captcha', new FormControl('', [Validators.required]));
        }
        if (this.enableCaptcha == true) {
          this.refreshCaptcha();
        }
        this._notify.error('', 'Tài khoản hoặc mật khẩu chưa đúng');
      }
    )
  }

  register() {
    this._router.navigate(['/auth/register-form']);
  }

  refreshCaptcha() {
    this._authService.getCaptchaCode().subscribe(res => {
      if (res) {
        this.strCaptchar = res;
        this._authService.getCaptchaImg(this.strCaptchar).subscribe(resp => {
          this.imgCaptcha = resp.imgCaptcha;
        })
      }
    })
  }

  forgetPassword() {
    this._router.navigate(['/auth/forget-password']);
  }
}
