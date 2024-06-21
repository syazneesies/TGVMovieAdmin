import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberBookingsComponent } from './member-bookings.component';

describe('MemberBookingsComponent', () => {
  let component: MemberBookingsComponent;
  let fixture: ComponentFixture<MemberBookingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MemberBookingsComponent]
    });
    fixture = TestBed.createComponent(MemberBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
