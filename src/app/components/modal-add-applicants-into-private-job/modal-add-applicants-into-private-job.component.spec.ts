import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddApplicantsIntoPrivateJobComponent } from './modal-add-applicants-into-private-job.component';

describe('ModalAddApplicantsIntoPrivateJobComponent', () => {
  let component: ModalAddApplicantsIntoPrivateJobComponent;
  let fixture: ComponentFixture<ModalAddApplicantsIntoPrivateJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddApplicantsIntoPrivateJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddApplicantsIntoPrivateJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
