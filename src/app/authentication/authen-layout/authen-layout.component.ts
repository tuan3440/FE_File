import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzGridModule} from "ng-zorro-antd/grid";
import {RouterOutlet} from "@angular/router";
import {NzCardModule} from "ng-zorro-antd/card";

@Component({
  selector: 'app-authen-layout',
  standalone: true,
  imports: [CommonModule, NzGridModule, RouterOutlet, NzCardModule],
  templateUrl: './authen-layout.component.html',
  styleUrls: ['./authen-layout.component.scss']
})
export class AuthenLayoutComponent {

}
