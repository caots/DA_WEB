import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingJobseekerComponent } from './landing-jobseeker.component';

describe('LandingJobseekerComponent', () => {
  let component: LandingJobseekerComponent;
  let fixture: ComponentFixture<LandingJobseekerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingJobseekerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingJobseekerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
