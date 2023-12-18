import {Component, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzFormatEmitEvent, NzTreeComponent, NzTreeModule, NzTreeNodeOptions} from "ng-zorro-antd/tree";
import {SysModuleService} from "../../../@core/service/authorization/sysModule.service";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-sys-module-tree',
  standalone: true,
  imports: [CommonModule, NzTreeModule],
  templateUrl: './sys-module-tree.component.html',
  styleUrls: ['./sys-module-tree.component.scss'],
  providers: [
    NzModalService
  ]
})
export class SysModuleTreeComponent implements OnInit {
  @ViewChild('nzTreeComponent', { static: false }) nzTreeComponent!: NzTreeComponent;
  nodes: NzTreeNodeOptions[] = [];
  constructor(
    private _sysModuleService: SysModuleService,
    private _modalRef: NzModalRef
  ) {
  }
  ngOnInit() {
    this.openTree();
  }

  nzClick(event: NzFormatEmitEvent) {
    switch (event.eventName) {
      case 'click':
        this._modalRef.close(event.node);
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
          key: node.id.toString(),
          title: node.name,
          children: this.parseData(node.children)
        });
      })
    }
    return data;
  }
}
