import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CREATE_JOB_TYPE } from 'src/app/constants/config';

@Component({
  selector: 'ms-modal-new-job-scratch-or-template',
  templateUrl: './modal-new-job-scratch-or-template.component.html',
  styleUrls: ['./modal-new-job-scratch-or-template.component.scss']
})
export class ModalNewJobScratchOrTemplateComponent implements OnInit {
  @Output() close = new EventEmitter();
  @Output() nexStep = new EventEmitter();
  createJobType = CREATE_JOB_TYPE;
  type: number = CREATE_JOB_TYPE.NONE;

  constructor() { }

  ngOnInit(): void {
  }

  closeModal() {
    this.close.emit();
  }

  nextStep() {
    this.nexStep.emit(this.type);
  }

  onItemChange(value) {
    this.type = value;
  }
}
