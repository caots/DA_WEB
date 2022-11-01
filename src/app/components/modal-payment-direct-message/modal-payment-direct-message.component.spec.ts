import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPaymentDirectMessageComponent } from './modal-payment-direct-message.component';

describe('ModalPaymentDirectMessageComponent', () => {
  let component: ModalPaymentDirectMessageComponent;
  let fixture: ComponentFixture<ModalPaymentDirectMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPaymentDirectMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPaymentDirectMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
