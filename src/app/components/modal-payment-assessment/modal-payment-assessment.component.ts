import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { STEP_CREATE_JOB } from 'src/app/constants/config';
import { CardInfo, CardSettings } from 'src/app/interfaces/cardInfo';
import { PaymentService } from 'src/app/services/payment.service';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'ms-modal-payment-assessment',
  templateUrl: './modal-payment-assessment.component.html',
  styleUrls: ['./modal-payment-assessment.component.scss']
})
export class ModalPaymentAssessmentComponent implements OnInit {

  @Output() close = new EventEmitter();
  @Input() settings: CardSettings;
  @Input() sendDataAssessment: any;
  @Input() assessmentInfo: any;
  cardInfo: CardInfo;
  step: number = STEP_CREATE_JOB.STEP_1;
  stepCreateJob = STEP_CREATE_JOB;

  constructor(
    private subjectService: SubjectService,
    private paymentService: PaymentService
  ) {
  }


  ngOnInit(): void {
    this.subjectService.checkPaymentTopupDone.subscribe(data => {
      if (data) {
        this.close.emit();
        this.subjectService.checkPaymentTopupDone.next(false);
      }
    })
  }

  closeModal(event) {
    this.close.emit();
  }

  continuteStep(step) {
    if (step == STEP_CREATE_JOB.STEP_1) {
      this.step = STEP_CREATE_JOB.STEP_2;
      return;
    }
    if (step == STEP_CREATE_JOB.STEP_2) {
      return;
    }
  }
}
