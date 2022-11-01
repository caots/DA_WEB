import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalChangeWeightAssessmentComponent } from './modal-change-weight-assessment.component';

describe('ModalChangeWeightAssessmentComponent', () => {
  let component: ModalChangeWeightAssessmentComponent;
  let fixture: ComponentFixture<ModalChangeWeightAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalChangeWeightAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalChangeWeightAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
