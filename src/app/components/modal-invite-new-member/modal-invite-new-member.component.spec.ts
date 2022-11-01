import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInviteNewMemberComponent } from './modal-invite-new-member.component';

describe('ModalInviteNewMemberComponent', () => {
  let component: ModalInviteNewMemberComponent;
  let fixture: ComponentFixture<ModalInviteNewMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalInviteNewMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalInviteNewMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
