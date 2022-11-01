import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddAssessmentToExistsJobComponent } from './modal-add-assessment-to-exists-job.component';

describe('ModalAddAssessmentToExistsJobComponent', () => {
  let component: ModalAddAssessmentToExistsJobComponent;
  let fixture: ComponentFixture<ModalAddAssessmentToExistsJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddAssessmentToExistsJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddAssessmentToExistsJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
