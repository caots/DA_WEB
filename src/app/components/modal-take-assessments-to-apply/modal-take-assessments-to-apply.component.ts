import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ms-modal-take-assessments-to-apply',
  templateUrl: './modal-take-assessments-to-apply.component.html',
  styleUrls: ['./modal-take-assessments-to-apply.component.scss']
})
export class ModalTakeAssessmentsToApplyComponent implements OnInit {
  @Output() close = new EventEmitter();
  listBenefit: any;
  constructor() { }

  ngOnInit(): void {
    this.listBenefit = [
      {
        status: true,
        title: 'Eight Hour Shift'
      },
      {
        status: false,
        title: 'Eight Hour Shift'
      }
      ,
      {
        status: false,
        title: 'Eight Hour Shift'
      }
      ,
      {
        status: false,
        title: 'Eight Hour Shift'
      }
      ,
      {
        status: false,
        title: 'Eight Hour Shift'
      }
      ,
      {
        status: false,
        title: 'Eight Hour Shift'
      }
      ,
      {
        status: false,
        title: 'Eight Hour Shift'
      }
      ,
      {
        status: false,
        title: 'Eight Hour Shift'
      }
      ,
      {
        status: false,
        title: 'Eight Hour Shift'
      }
      ,
      {
        status: false,
        title: 'Eight Hour Shift'
      }
      ,
      {
        status: false,
        title: 'Eight Hour Shift'
      }
      ,
      {
        status: false,
        title: 'Eight Hour Shift'
      }
      ,
      {
        status: false,
        title: 'Eight Hour Shift'
      }
      ,
      {
        status: false,
        title: 'Eight Hour Shift'
      }
      ,
      {
        status: false,
        title: 'Eight Hour Shift'
      }
    ]
  }

  closeModal() {
    this.close.emit();
  }

}
