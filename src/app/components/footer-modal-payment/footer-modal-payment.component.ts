import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CardInfo } from 'src/app/interfaces/cardInfo';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'ms-footer-modal-payment',
  templateUrl: './footer-modal-payment.component.html',
  styleUrls: ['./footer-modal-payment.component.scss']
})
export class FooterModalPaymentComponent implements OnInit {
  @Input() card: CardInfo;
  @Input() isShoppingCard: boolean;
  @Input() isVisiableButtonPayment: boolean;
  @Input() isDirectMessage: boolean;
  @Input() isPaymentAssessment: boolean;
  @Input() isConfirmInformation: boolean;
  @Output() onCloseModal = new EventEmitter();
  @Output() onChangeCardPaymentSubmit = new EventEmitter();
  @Output() onChangeCardPaymentCartSubmit = new EventEmitter();
  @Output() onConfirmPaymentSubmit = new EventEmitter();
  @Output() onConfirmInfomationCard = new EventEmitter();
  isLoadingCard: boolean;
  isSaveCard = 1;
  typeButton = 0; // 1: change cart, 2: payment , 3: confirm address
  constructor(
    private subjectService: SubjectService
  ) { }

  ngOnInit(): void {
    this.subjectService.isLoadingCard.subscribe(loading => {
      this.isLoadingCard = loading;
    });
    this.subjectService.isSaveCard.subscribe(res => {
      this.isSaveCard = res;
    });
  }

  closeModal() {
    this.onCloseModal.emit();
  }

  changeCardPaymentSubmit() {
    this.typeButton = 1;
    this.subjectService.isLoadingCard.next(true);    
    this.onChangeCardPaymentSubmit.emit();
    this.subjectService.isSaveCard.next(this.isSaveCard);
  }

  confirmPaymentSubmit() {
    this.typeButton = 2;
    this.onConfirmPaymentSubmit.emit();
    this.subjectService.isSaveCard.next(this.isSaveCard);
  }

  confirmInfomationCard(){
    this.typeButton = 3;
    this.onConfirmInfomationCard.emit();
  }

}
