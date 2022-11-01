import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmFreePaymentComponent } from './modal-confirm-free-payment.component';

describe('ModalConfirmFreePaymentComponent', () => {
  let component: ModalConfirmFreePaymentComponent;
  let fixture: ComponentFixture<ModalConfirmFreePaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalConfirmFreePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfirmFreePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
