import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmVerificationEmailComponent } from './modal-confirm-verification-email.component';

describe('ModalConfirmVerificationEmailComponent', () => {
  let component: ModalConfirmVerificationEmailComponent;
  let fixture: ComponentFixture<ModalConfirmVerificationEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalConfirmVerificationEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfirmVerificationEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
