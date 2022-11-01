import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPaymentConfirmationComponent } from './modal-payment-confirmation.component';

describe('ModalPaymentConfirmationComponent', () => {
  let component: ModalPaymentConfirmationComponent;
  let fixture: ComponentFixture<ModalPaymentConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPaymentConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPaymentConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
