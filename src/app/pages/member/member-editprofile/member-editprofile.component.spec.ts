import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberEditprofileComponent } from './member-editprofile.component';

describe('MemberEditprofileComponent', () => {
  let component: MemberEditprofileComponent;
  let fixture: ComponentFixture<MemberEditprofileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MemberEditprofileComponent]
    });
    fixture = TestBed.createComponent(MemberEditprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
