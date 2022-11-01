import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletePasswordUserPotentialComponent } from './complete-password-user-potential.component';

describe('CompletePasswordUserPotentialComponent', () => {
  let component: CompletePasswordUserPotentialComponent;
  let fixture: ComponentFixture<CompletePasswordUserPotentialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletePasswordUserPotentialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletePasswordUserPotentialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
