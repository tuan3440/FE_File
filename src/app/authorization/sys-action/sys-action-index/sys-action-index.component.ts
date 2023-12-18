import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SysActionSearchComponent} from "../sys-action-search/sys-action-search.component";
import {CommonUtils} from "../../../@core/service/common-utils.service";

@Component({
  selector: 'app-sys-action-index',
  standalone: true,
  imports: [CommonModule, SysActionSearchComponent],
  templateUrl: './sys-action-index.component.html',
  styleUrls: ['./sys-action-index.component.scss']
})
export class SysActionIndexComponent {
  checkVisible(action: string) {
    return CommonUtils.hasPermission('MANAGE_ACTION', action);
  }
}
