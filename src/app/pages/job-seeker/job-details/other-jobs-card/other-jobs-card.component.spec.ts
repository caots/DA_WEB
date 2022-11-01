import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherJobsCardComponent } from './other-jobs-card.component';

describe('OtherJobsCardComponent', () => {
  let component: OtherJobsCardComponent;
  let fixture: ComponentFixture<OtherJobsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherJobsCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherJobsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
