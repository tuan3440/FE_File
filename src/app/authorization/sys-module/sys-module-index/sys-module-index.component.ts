import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SysModuleSearchComponent} from "../sys-module-search/sys-module-search.component";
import {CommonUtils} from "../../../@core/service/common-utils.service";

@Component({
  selector: 'app-sys-module-index',
  standalone: true,
  imports: [CommonModule, SysModuleSearchComponent],
  templateUrl: './sys-module-index.component.html',
  styleUrls: ['./sys-module-index.component.scss']
})
export class SysModuleIndexComponent {
  checkVisible(action: string) {
    return CommonUtils.hasPermission('MANAGE_MODULE', action);
  }
}
