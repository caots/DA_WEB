import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentShoppingCartStep1Component } from './payment-shopping-cart-step1.component';

describe('PaymentShoppingCartStep1Component', () => {
  let component: PaymentShoppingCartStep1Component;
  let fixture: ComponentFixture<PaymentShoppingCartStep1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentShoppingCartStep1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentShoppingCartStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
