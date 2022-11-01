import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PAYMENT_DRAFT_PRIVATE_JOB } from 'src/app/constants/config';

@Component({
  selector: 'ms-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss']
})

export class ModalConfirmComponent implements OnInit {
  @Input() title: string;
  @Input() isPaymentPrivateDraftJob: boolean;
  @Input() btnPaymentText: string;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;
  
  constructor(
    private activeModal: NgbActiveModal
  ) {
  }

  ngOnInit(): void {
  }

  yes() {
    this.activeModal.close(true);
  }

  payment() {
    this.activeModal.close(PAYMENT_DRAFT_PRIVATE_JOB);
  }

  no() {
    this.activeModal.close(false);
  }
}
