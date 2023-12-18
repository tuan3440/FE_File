import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SysUserSearchComponent} from "../sys-user-search/sys-user-search.component";
import {CommonUtils} from "../../../@core/service/common-utils.service";

@Component({
  selector: 'app-sys-user-index',
  standalone: true,
  imports: [CommonModule, SysUserSearchComponent],
  templateUrl: './sys-user-index.component.html',
  styleUrls: ['./sys-user-index.component.scss']
})
export class SysUserIndexComponent {
  checkVisible(action: string) {
    return CommonUtils.hasPermission('MANAGE_USER', action);
  }
}
