import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzFormatEmitEvent, NzTreeComponent, NzTreeModule, NzTreeNodeOptions} from "ng-zorro-antd/tree";
import {SysModuleService} from "../../../@core/service/authorization/sysModule.service";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-sys-module-sidebar',
  standalone: true,
  imports: [CommonModule, NzTreeModule],
  templateUrl: './sys-module-sidebar.component.html',
  styleUrls: ['./sys-module-sidebar.component.scss'],
})
export class SysModuleSidebarComponent implements OnInit {
  @Output() changeParentId: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('nzTreeComponent', { static: false }) nzTreeComponent!: NzTreeComponent;
  nodes: NzTreeNodeOptions[] = [];
  constructor(
    private _sysModuleService: SysModuleService,
  ) {
  }
  ngOnInit() {
    this.openTree();
  }

  nzClick(event: NzFormatEmitEvent) {
    switch (event.eventName) {
      case 'click':
        if (event.node) {
          this.changeParentId.emit(event.node.key);
        }
        break;
      default:
        break;
    }
  }

  openTree() {
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
        if (node.children.length > 0) {
          data.push({
            key: node.id.toString(),
            title: node.name,
            children: this.parseData(node.children)
          });
        } else {
          data.push({
            key: node.id.toString(),
            title: node.name,
            children: [],
            isLeaf: true
          });
        }

      })
    }
    return data;
  }
}
