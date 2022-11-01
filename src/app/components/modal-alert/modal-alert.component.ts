import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ms-modal-alert',
  templateUrl: './modal-alert.component.html',
  styleUrls: ['./modal-alert.component.scss']
})
export class ModalAlertComponent implements OnInit {
  @Output() close = new EventEmitter();
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }
  closeModal() {
    this.close.emit();
  }
}
