import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPaymentAssessmentComponent } from './modal-payment-assessment.component';

describe('ModalPaymentAssessmentComponent', () => {
  let component: ModalPaymentAssessmentComponent;
  let fixture: ComponentFixture<ModalPaymentAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPaymentAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPaymentAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
