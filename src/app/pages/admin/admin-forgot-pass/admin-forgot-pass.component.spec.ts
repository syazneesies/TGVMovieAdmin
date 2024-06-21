import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminForgotPassComponent } from './admin-forgot-pass.component';

describe('AdminForgotPassComponent', () => {
  let component: AdminForgotPassComponent;
  let fixture: ComponentFixture<AdminForgotPassComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminForgotPassComponent]
    });
    fixture = TestBed.createComponent(AdminForgotPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
