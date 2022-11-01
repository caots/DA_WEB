import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeCustomeAssessmentQuestionComponent } from './take-custome-assessment-question.component';

describe('TakeCustomeAssessmentQuestionComponent', () => {
  let component: TakeCustomeAssessmentQuestionComponent;
  let fixture: ComponentFixture<TakeCustomeAssessmentQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TakeCustomeAssessmentQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakeCustomeAssessmentQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
