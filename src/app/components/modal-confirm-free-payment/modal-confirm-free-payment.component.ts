import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'ms-modal-confirm-free-payment',
  templateUrl: './modal-confirm-free-payment.component.html',
  styleUrls: ['./modal-confirm-free-payment.component.scss']
})
export class ModalConfirmFreePaymentComponent implements OnInit {
  @Output() close = new EventEmitter();
  @Output() complete = new EventEmitter();
  @Input() cardSettings: any;
  @Input() isDirectMessage: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  submit(){
    this.complete.next();
  }

  closeModal(){
    this.close.emit();
  }

}
