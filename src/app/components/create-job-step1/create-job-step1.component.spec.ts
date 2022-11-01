import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateJobStep1Component } from './create-job-step1.component';

describe('CreateJobStep1Component', () => {
  let component: CreateJobStep1Component;
  let fixture: ComponentFixture<CreateJobStep1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateJobStep1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateJobStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
