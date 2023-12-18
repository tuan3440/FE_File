import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzButtonModule} from "ng-zorro-antd/button";
import {AuthService} from "../../@core/service/auth/auth/auth.service";
import {CommonUtils} from "../../@core/service/common-utils.service";
import {Router} from "@angular/router";
import {NzNotificationService} from "ng-zorro-antd/notification";

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, NzFormModule, ReactiveFormsModule, NzInputModule, NzButtonModule],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  providers: [
    NzNotificationService
  ]
})
export class RegisterFormComponent implements OnInit {
  registerForm: FormGroup = new FormGroup<any>({
    fullName: new FormControl(''),
    email: new FormControl(''),
    login: new FormControl(''),
    password: new FormControl(''),
  })

  constructor(
    private _authService: AuthService,
    private _route: Router,
    private _notify: NzNotificationService
  ) {
  }

  ngOnInit(): void {
  }

  submitForm() {
    if (!CommonUtils.isValidForm(this.registerForm)) {
      return;
    }
    const data = this.registerForm.value;
    this._authService.register(data).subscribe(res => {
      this._notify.success('', 'Đăng ký thành công, vui lòng đăng nhập');
      this._route.navigate(['auth/login']);

    },
    error => {
      console.log('bb', error);
    })
  }
}
