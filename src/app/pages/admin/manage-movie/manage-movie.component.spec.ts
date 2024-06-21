import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMovieComponent } from './manage-movie.component';

describe('ManageMovieComponent', () => {
  let component: ManageMovieComponent;
  let fixture: ComponentFixture<ManageMovieComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageMovieComponent]
    });
    fixture = TestBed.createComponent(ManageMovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
