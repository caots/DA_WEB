import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { STEP_CREATE_JOB } from 'src/app/constants/config';
import { CardInfo, CardSettings } from 'src/app/interfaces/cardInfo';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'ms-modal-payment-direct-message',
  templateUrl: './modal-payment-direct-message.component.html',
  styleUrls: ['./modal-payment-direct-message.component.scss']
})
export class ModalPaymentDirectMessageComponent implements OnInit {

  @Output() close = new EventEmitter();
  @Input() settings: CardSettings;
  @Input() sendDmCandidateData: any;
  @Input() candidateInfo: any;
  cardInfo: CardInfo;
  step: number = STEP_CREATE_JOB.STEP_1;
  stepCreateJob = STEP_CREATE_JOB;

  constructor(
    private paymentService: PaymentService
  ) {
  }


  ngOnInit(): void {
    this.getCardInfo();
  }

  getCardInfo() {
    this.paymentService.getCardInfo().subscribe(res => {
      this.cardInfo = res;
    }, errorRes => {
      //console.log(errorRes);
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
