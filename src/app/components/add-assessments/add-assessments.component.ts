import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { Assesment } from 'src/app/interfaces/assesment';
import { UserInfo } from 'src/app/interfaces/userInfo';
@Component({
  selector: 'ms-add-assessments',
  templateUrl: './add-assessments.component.html',
  styleUrls: ['./add-assessments.component.scss']
})
export class AddAssessmentsComponent implements OnInit {
  @Output() next = new EventEmitter();
  @Output() remove = new EventEmitter();
  @Output() payment = new EventEmitter();
  @Output() validate = new EventEmitter();
  @Output() retry = new EventEmitter();
  @Input() dataAssessment: any;
  @Input() userData: UserInfo;
  isAddAssessment: boolean = true;

  constructor() { }

  ngOnInit(): void {
    console.log(this.userData);
    
  }

  goToSearchAssessment() {
    this.next.emit();
  }

  removeAssessment(assesment) {
    this.remove.emit(assesment);
  }

  validateAssessment(assessment) {
    this.validate.emit(assessment)
  }

  retryAssessment(assessment) {
    this.retry.emit(assessment)
  }

  paymentAssessment(assessment){
    this.payment.emit(assessment)
  }

}
