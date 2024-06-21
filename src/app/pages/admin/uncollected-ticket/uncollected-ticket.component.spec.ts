import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UncollectedTicketComponent } from './uncollected-ticket.component';

describe('UncollectedTicketComponent', () => {
  let component: UncollectedTicketComponent;
  let fixture: ComponentFixture<UncollectedTicketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UncollectedTicketComponent]
    });
    fixture = TestBed.createComponent(UncollectedTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
