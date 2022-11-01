import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { USER_TYPE, PAYMENT_TYPE, JOBSEEKER_PAYMENT_REDIRECT, EMPLOYER_PAYMENT } from 'src/app/constants/config';
import { CardInfo } from 'src/app/interfaces/cardInfo';
import { ItemJobCarts } from 'src/app/interfaces/itemJobCarts';
import { PaymentConvergeService } from 'src/app/services/payment-converge.service';

@Component({
  selector: 'ms-modal-payment-confirmation-jobseeker',
  templateUrl: './modal-payment-confirmation.component.html',
  styleUrls: ['./modal-payment-confirmation.component.scss']
})
export class ModalPaymentConfirmationComponentJobseeker implements OnInit {
  @Input() topup: any;
  @Input() isCredit: boolean;
  @Input() isDmCandidate: boolean;
  @Input() card: CardInfo;
  @Output() close = new EventEmitter();
  @Output() submit = new EventEmitter();
  constructor(
    private paymentConvergeService: PaymentConvergeService,
  ) { }

  ngOnInit(): void {
  }

  closeModal() {
    this.close.emit(status);
  }

  changeCardPaymentSubmit() {
    let data = {
      paymentType: this.isCredit? PAYMENT_TYPE.Credit : PAYMENT_TYPE.Topup,
    }
    if (this.isDmCandidate){
      data = Object.assign({}, data, { numCredit: this.topup.num_dm });
      this.paymentConvergeService.getPayment(this.topup.totalPrice, data, USER_TYPE.EMPLOYER, EMPLOYER_PAYMENT.messageTopup).subscribe();
    }else {
      data = Object.assign({}, data, { numRetake: this.topup.num_retake });
      this.paymentConvergeService.getPayment(this.topup.totalPrice, data, USER_TYPE.JOB_SEEKER, JOBSEEKER_PAYMENT_REDIRECT.profile).subscribe();
    }
    this.close.emit(status);
  }

  confirmPaymentSubmit() {
    this.submit.emit(this.topup);
  }

}
