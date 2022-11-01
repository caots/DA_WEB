import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultTakeCustomAssessmentComponent } from './result-take-custom-assessment.component';

describe('ResultTakeCustomAssessmentComponent', () => {
  let component: ResultTakeCustomAssessmentComponent;
  let fixture: ComponentFixture<ResultTakeCustomAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultTakeCustomAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultTakeCustomAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
