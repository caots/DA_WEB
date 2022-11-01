import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PaymentConvergeService } from 'src/app/services/payment-converge.service';
import { CardInfo } from 'src/app/interfaces/cardInfo';
import { SubjectService } from 'src/app/services/subject.service';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'ms-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss']
})
export class PaymentMethodsComponent implements OnInit {
  modalAddPaymentMethodRef: NgbModalRef;
  @Input() user: any;
  @Input() hiddenUpdate: boolean;
  @Input() hiddenTitle: boolean;
  @Input() hiddenTitleBox: boolean;
  @Output() deleteCard = new EventEmitter();
  @Output() updateCard = new EventEmitter();
  isLoadingCard: boolean;
  cardInfo: CardInfo;
  
  constructor(
    private subjectService: SubjectService,
    public paymentService: PaymentService
  ) { }

  ngOnInit(): void {
    this.subjectService.cart.subscribe(data => {
      this.cardInfo = data;
    })

    this.subjectService.isLoadingCard.subscribe(loading => {
      this.isLoadingCard = loading;
    });
  }

  addPaymentMethod() {
    this.updateCard.emit();
  }

  onDeleteCard() {
    this.deleteCard.emit();
  }
}
