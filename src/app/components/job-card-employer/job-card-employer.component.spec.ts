import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCardEmployerComponent } from './job-card-employer.component';

describe('JobCardEmployerComponent', () => {
  let component: JobCardEmployerComponent;
  let fixture: ComponentFixture<JobCardEmployerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobCardEmployerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobCardEmployerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
