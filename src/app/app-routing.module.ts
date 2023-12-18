import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from "./layout/layout.component";
import {AuthGuard} from "./shared/guards/auth.guard";
import {WelcomeComponent} from "./welcome/welcome.component";

export const routes: Routes = [
  {
    path: "error",
    loadChildren: () =>
      import("./error/error.module").then(
        (c) => c.ErrorModule
      ),
  },
  {
    path: "pages",
    component: LayoutComponent,
    children: [
      {
        path: "",
        component: WelcomeComponent
      },
      {
        path: "auth-manage",
        loadChildren: () =>
          import("./authorization/authorization.module").then(
            (c) => c.AuthorizationModule
          )
      },
      {
        path: "management",
        loadChildren: () =>
          import("./management/management.module").then(
            (c) => c.ManagementModule
          )
      },
    ]
  },
  {
    path: "auth",
    loadChildren: () =>
      import("./authentication/authentication.module").then(
        (c) => c.AuthenticationModule
      ),
  },
  {
    path: '', redirectTo: 'auth',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
