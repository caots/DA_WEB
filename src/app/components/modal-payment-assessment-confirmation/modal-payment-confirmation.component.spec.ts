import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPaymentAssessmentConfirmationComponent } from './modal-payment-confirmation.component';

describe('ModalPaymentAssessmentConfirmationComponent', () => {
  let component: ModalPaymentAssessmentConfirmationComponent;
  let fixture: ComponentFixture<ModalPaymentAssessmentConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPaymentAssessmentConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPaymentAssessmentConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
