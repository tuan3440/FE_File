import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SysActionIndexComponent} from "./sys-action/sys-action-index/sys-action-index.component";
import {SysModuleIndexComponent} from "./sys-module/sys-module-index/sys-module-index.component";
import {SysRoleIndexComponent} from "./sys-role/sys-role-index/sys-role-index.component";
import {SysUserIndexComponent} from "./sys-user/sys-user-index/sys-user-index.component";

const routes: Routes = [
  {
    path: 'sys-role',
    component: SysRoleIndexComponent
  },
  {
    path: 'sys-action',
    component: SysActionIndexComponent
  },
  {
    path: 'sys-module',
    component: SysModuleIndexComponent
  },
  {
    path: 'sys-user',
    component: SysUserIndexComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthorizationRoutingModule { }
