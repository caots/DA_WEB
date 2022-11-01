import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { USER_TYPE, JOBSEEKER_PAYMENT_REDIRECT, PAYMENT_TYPE, EMPLOYER_PAYMENT } from 'src/app/constants/config';
import { Candidate } from 'src/app/interfaces/candidate';
import { CardSettings } from 'src/app/interfaces/cardInfo';
import { ItemJobCarts } from 'src/app/interfaces/itemJobCarts';
import { PaymentConvergeService } from 'src/app/services/payment-converge.service';

@Component({
  selector: 'ms-modal-payment-assessment-confirmation',
  templateUrl: './modal-payment-confirmation.component.html',
  styleUrls: ['./modal-payment-confirmation.component.scss']
})
export class ModalPaymentAssessmentConfirmationComponent implements OnInit {
  @Input() assessmentInfo: any;
  @Input() candidateInfo: Candidate;
  @Input() settingsCard: CardSettings;
  @Input() sendDmCandidateData: any;
  @Input() isDmCandidate: boolean;
  @Input() card: any;
  @Output() close = new EventEmitter();
  @Output() submit = new EventEmitter();
  constructor(
    private paymentConvergeService: PaymentConvergeService,
  ) { }

  ngOnInit(): void {
    //console.log(this.settingsCard);
  }

  closeModal() {
    this.close.emit(status);
  }

  changeCardPaymentSubmit() {
    if (this.isDmCandidate) {
      this.sendDmCandidateData = this.sendDmCandidateData && Object.assign({}, this.sendDmCandidateData, { candidate: this.candidateInfo });
      this.paymentConvergeService.getPayment(this.settingsCard.standard_direct_message_price, this.sendDmCandidateData, USER_TYPE.EMPLOYER, EMPLOYER_PAYMENT.messageTopup).subscribe();
    } else {
      this.paymentConvergeService.getPayment(this.settingsCard.standard_validation_price, this.assessmentInfo, USER_TYPE.JOB_SEEKER, JOBSEEKER_PAYMENT_REDIRECT.imocha).subscribe();
    }
    this.close.emit(status);
  }

  confirmPaymentSubmit() {
    this.submit.emit(this.assessmentInfo);
  }

}
