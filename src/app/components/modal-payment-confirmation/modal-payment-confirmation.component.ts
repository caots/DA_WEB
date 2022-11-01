import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { USER_TYPE, JOBSEEKER_PAYMENT_REDIRECT } from 'src/app/constants/config';
import { ItemJobCarts } from 'src/app/interfaces/itemJobCarts';
import { PaymentConvergeService } from 'src/app/services/payment-converge.service';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'ms-modal-payment-confirmation',
  templateUrl: './modal-payment-confirmation.component.html',
  styleUrls: ['./modal-payment-confirmation.component.scss']
})
export class ModalPaymentConfirmationComponent implements OnInit {
  @Input() cardInfo: any;
  @Input() card: any;
  @Input() listCard: ItemJobCarts[];
  @Output() close = new EventEmitter();
  @Output() submit = new EventEmitter();
  constructor(
    private paymentConvergeService: PaymentConvergeService,
    private subjectService: SubjectService
  ) { }

  ngOnInit(): void {
    //console.log(this.card);
    this.subjectService.hiddenPaymentModal.subscribe(hidden => {
      if (!hidden) return;
      this.close.emit(status);
      this.subjectService.hiddenPaymentModal.next(false);
    });
  }

  closeModal() {
    this.close.emit(status);
  }

  changeCardPaymentSubmit() {
    this.paymentConvergeService.getPayment(this.cardInfo.totalPrice, this.getListIdJobCard(), USER_TYPE.EMPLOYER, JOBSEEKER_PAYMENT_REDIRECT.other).subscribe();
  }

  confirmPaymentSubmit() {
    this.subjectService.isLoadingCard.next(true);
    this.submit.emit(this.getListIdJobCard());
  }

  updateCard() {

  }
  deleteCard(data) {
  }

  getListIdJobCard() {
    let result = [];
    this.listCard.map(card => {
      if (card.jobSelected) {
        result.push({ id: card.id });
      }
    })
    return result;
  }
}
