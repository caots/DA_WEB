import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ms-modal-confirm-verification-email',
  templateUrl: './modal-confirm-verification-email.component.html',
  styleUrls: ['./modal-confirm-verification-email.component.scss']
})
export class ModalConfirmVerificationEmailComponent implements OnInit {
  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

  closeModal(){
    this.activeModal.close();
  }

}
