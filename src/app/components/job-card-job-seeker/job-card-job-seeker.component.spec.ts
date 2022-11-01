import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCardJobSeekerComponent } from './job-card-job-seeker.component';

describe('JobCardJobSeekerComponent', () => {
  let component: JobCardJobSeekerComponent;
  let fixture: ComponentFixture<JobCardJobSeekerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobCardJobSeekerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobCardJobSeekerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
