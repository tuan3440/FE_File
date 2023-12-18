import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysRoleFormComponent } from './sys-role-form.component';

describe('SysRoleFormComponent', () => {
  let component: SysRoleFormComponent;
  let fixture: ComponentFixture<SysRoleFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SysRoleFormComponent]
    });
    fixture = TestBed.createComponent(SysRoleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
