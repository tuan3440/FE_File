import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SysRoleSearchComponent} from "../sys-role-search/sys-role-search.component";
import {CommonUtils} from "../../../@core/service/common-utils.service";

@Component({
  selector: 'app-sys-role-index',
  standalone: true,
  imports: [CommonModule, SysRoleSearchComponent],
  templateUrl: './sys-role-index.component.html',
  styleUrls: ['./sys-role-index.component.scss']
})
export class SysRoleIndexComponent {
  checkVisible(action: string) {
    return CommonUtils.hasPermission('MANAGE_ROLE', action);
  }
}
