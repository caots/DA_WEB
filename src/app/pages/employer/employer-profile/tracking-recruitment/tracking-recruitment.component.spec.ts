import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingRecruitmentComponent } from './tracking-recruitment.component';

describe('TrackingRecruitmentComponent', () => {
  let component: TrackingRecruitmentComponent;
  let fixture: ComponentFixture<TrackingRecruitmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackingRecruitmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingRecruitmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
