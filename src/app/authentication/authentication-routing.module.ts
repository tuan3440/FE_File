import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthenLayoutComponent} from "./authen-layout/authen-layout.component";

const routes: Routes = [
  {
    path: "",
    component: AuthenLayoutComponent,
    children: [
      {
        path: "register-form",
        loadComponent: () =>
          import("./register-form/register-form.component").then(
            (c) => c.RegisterFormComponent
          ),
      },
      {
        path: "login",
        loadComponent: () =>
          import("./login/login.component").then(
            (c) => c.LoginComponent
          ),
      },
      {
        path: "forget-password",
        loadComponent: () =>
          import("./forget-password/forget-password.component").then(
            (c) => c.ForgetPasswordComponent
          ),
      },
      {
        path: "**",
        redirectTo: "login"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
