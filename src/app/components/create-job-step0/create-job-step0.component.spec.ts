import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateJobStep0Component } from './create-job-step0.component';

describe('CreateJobStep0Component', () => {
  let component: CreateJobStep0Component;
  let fixture: ComponentFixture<CreateJobStep0Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateJobStep0Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateJobStep0Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
