import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCardPreviewEmployerComponent } from './job-card-preview-employer.component';

describe('JobCardPreviewEmployerComponent', () => {
  let component: JobCardPreviewEmployerComponent;
  let fixture: ComponentFixture<JobCardPreviewEmployerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobCardPreviewEmployerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobCardPreviewEmployerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
