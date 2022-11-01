import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateJobStep3Component } from './create-job-step3.component';

describe('CreateJobStep3Component', () => {
  let component: CreateJobStep3Component;
  let fixture: ComponentFixture<CreateJobStep3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateJobStep3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateJobStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
