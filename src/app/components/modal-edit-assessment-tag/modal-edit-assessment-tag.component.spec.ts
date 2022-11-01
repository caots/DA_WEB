import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditAssessmentTagComponent } from './modal-edit-assessment-tag.component';

describe('ModalEditAssessmentTagComponent', () => {
  let component: ModalEditAssessmentTagComponent;
  let fixture: ComponentFixture<ModalEditAssessmentTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEditAssessmentTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEditAssessmentTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
