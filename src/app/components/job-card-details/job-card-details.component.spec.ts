import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCardDetailsComponent } from './job-card-details.component';

describe('JobCardDetailsComponent', () => {
  let component: JobCardDetailsComponent;
  let fixture: ComponentFixture<JobCardDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobCardDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobCardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
