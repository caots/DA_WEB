import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPreviewInfoComponent } from './job-preview-info.component';

describe('JobPreviewInfoComponent', () => {
  let component: JobPreviewInfoComponent;
  let fixture: ComponentFixture<JobPreviewInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobPreviewInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobPreviewInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
