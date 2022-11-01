import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInviteJobCandidateComponent } from './modal-invite-job-candidate.component';

describe('ModalInviteJobCandidateComponent', () => {
  let component: ModalInviteJobCandidateComponent;
  let fixture: ComponentFixture<ModalInviteJobCandidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalInviteJobCandidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalInviteJobCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
