import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobJobseekerComponent } from './job-jobseeker.component';

describe('JobJobseekerComponent', () => {
  let component: JobJobseekerComponent;
  let fixture: ComponentFixture<JobJobseekerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobJobseekerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobJobseekerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
