import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterModalPaymentComponent } from './footer-modal-payment.component';

describe('FooterModalPaymentComponent', () => {
  let component: FooterModalPaymentComponent;
  let fixture: ComponentFixture<FooterModalPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterModalPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterModalPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
