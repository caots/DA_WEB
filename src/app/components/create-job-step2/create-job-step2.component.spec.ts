import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateJobStep2Component } from './create-job-step2.component';

describe('CreateJobStep2Component', () => {
  let component: CreateJobStep2Component;
  let fixture: ComponentFixture<CreateJobStep2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateJobStep2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateJobStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
