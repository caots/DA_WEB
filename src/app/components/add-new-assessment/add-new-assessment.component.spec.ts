import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewAssessmentComponent } from './add-new-assessment.component';

describe('AddNewAssessmentComponent', () => {
  let component: AddNewAssessmentComponent;
  let fixture: ComponentFixture<AddNewAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
