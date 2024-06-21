import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectedTicketComponent } from './collected-ticket.component';

describe('CollectedTicketComponent', () => {
  let component: CollectedTicketComponent;
  let fixture: ComponentFixture<CollectedTicketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollectedTicketComponent]
    });
    fixture = TestBed.createComponent(CollectedTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
