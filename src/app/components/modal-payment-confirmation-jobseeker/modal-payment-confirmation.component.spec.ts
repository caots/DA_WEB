import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPaymentConfirmationComponentJobseeker } from './modal-payment-confirmation.component';

describe('ModalPaymentConfirmationComponent', () => {
  let component: ModalPaymentConfirmationComponentJobseeker;
  let fixture: ComponentFixture<ModalPaymentConfirmationComponentJobseeker>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPaymentConfirmationComponentJobseeker ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPaymentConfirmationComponentJobseeker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
