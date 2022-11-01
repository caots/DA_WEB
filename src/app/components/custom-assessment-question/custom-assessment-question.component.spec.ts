import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAssessmentQuestionComponent } from './custom-assessment-question.component';

describe('CustomAssessmentQuestionComponent', () => {
  let component: CustomAssessmentQuestionComponent;
  let fixture: ComponentFixture<CustomAssessmentQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomAssessmentQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAssessmentQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
