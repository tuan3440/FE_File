import {Component, Inject, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzFormatEmitEvent, NzTreeComponent, NzTreeModule, NzTreeNode, NzTreeNodeOptions} from "ng-zorro-antd/tree";
import {SysModuleService} from "../../../@core/service/authorization/sysModule.service";
import {NZ_MODAL_DATA, NzModalRef} from "ng-zorro-antd/modal";
import {SysModuleActionService} from "../../../@core/service/authorization/sysModuleAction.service";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {SysRoleModuleService} from "../../../@core/service/authorization/sysRoleModule.service";
import {NzNotificationService} from "ng-zorro-antd/notification";

@Component({
  selector: 'app-sys-role-module',
  standalone: true,
    imports: [CommonModule, NzTreeModule, NzButtonModule, NzGridModule, NzWaveModule],
  templateUrl: './sys-role-module.component.html',
  styleUrls: ['./sys-role-module.component.scss'],
    providers: [
        NzNotificationService
    ]
})
export class SysRoleModuleComponent {
  @ViewChild('nzTreeComponent', { static: false }) nzTreeComponent!: NzTreeComponent;
  nodes: NzTreeNodeOptions[] = [];
  childrenCurrent: any[] = [];
  constructor(
    private _sysModuleService: SysModuleService,
    private _sysModuleActionService: SysModuleActionService,
    private _modalRef: NzModalRef,
    @Inject(NZ_MODAL_DATA) public data: any,
    private _sysRoleModuleService: SysRoleModuleService,
    private _notify: NzNotificationService,
  ) {
  }
  ngOnInit() {
    this.openTree();
  }

  nzClick(event: NzFormatEmitEvent) {
    console.log(event)

    switch (event.eventName) {
      case 'click':
        this._modalRef.close(event.node);
        break;
      case 'check':
        break;
      case 'expand':
        if (event.node) {
          this.addChildren(event.node.key, event.node);
        }
        break;
      default:
        break;
    }
  }

  private openTree() {
    this._sysModuleService.openTreeModule().subscribe(
      res => {
        this.nodes = this.parseData(res.body);
      }
    )
  }

  private parseData(body: any[]): NzTreeNodeOptions[] {
    const data: NzTreeNodeOptions[] = [];
    if (body && body.length > 0) {
      body.forEach(node => {
        data.push({
          key: node.code,
          title: node.name,
          children: this.parseData(node.children)
        });
      })
    }
    return data;
  }

  private addChildren(code: string, node: NzTreeNode)  {
    this._sysModuleActionService.getActionByModuleCode(code).subscribe(
      res => {
        if (res.body.length > 0) {
            let children =  res.body.map((item: { name: any; code: any; }) => ({
                title: item.name,
                key: code + '#' + item.code,
                isLeaf: true
            }));
            node.clearChildren();
            node.addChildren(children, 0);
        }
      },
      error => {
      }
    )
  }

    closePopup() {
        this._modalRef.close();
    }

    save() {
      let data: any[] = [];
      let itemSelected: NzTreeNode[] = this.nzTreeComponent.getCheckedNodeList();
      let itemHalfSelect: NzTreeNode[] = this.nzTreeComponent.getHalfCheckedNodeList();
      if (itemSelected.length > 0) {
        itemSelected.forEach(item => {
          let array: any[] = item.key.split("#");
          if (array.length == 2) {
            data.push(
                {
                    roleId: this.data.roleId,
                    actionCode: array[1],
                    moduleCode: array[0]
                }
            )
          }
        })
      }
      if (itemHalfSelect.length > 0) {
        itemHalfSelect.forEach(item => {
          let isExist : any[] = data.filter(x => x.moduleCode === item.key);
          if (isExist.length == 0) {
            data.push(
              {
                roleId: this.data.roleId,
                moduleCode: item.key
              }
            )
          }
        })
      }
      this._sysRoleModuleService.update(this.data.roleId, data).subscribe(
        res => {
          this._notify.success('', 'Update thành công');
          this._modalRef.close();
        },
          error => {

          }
      )
    }
}
