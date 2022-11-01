import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNoteApplicantComponent } from './modal-note-applicant.component';

describe('ModalNoteApplicantComponent', () => {
  let component: ModalNoteApplicantComponent;
  let fixture: ComponentFixture<ModalNoteApplicantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNoteApplicantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNoteApplicantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
