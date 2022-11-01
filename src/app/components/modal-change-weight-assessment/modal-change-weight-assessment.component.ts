import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MESSAGE } from 'src/app/constants/message';
import { Assesment } from 'src/app/interfaces/assesment';

@Component({
  selector: 'ms-modal-change-weight-assessment',
  templateUrl: './modal-change-weight-assessment.component.html',
  styleUrls: ['./modal-change-weight-assessment.component.scss']
})
export class ModalChangeWeightAssessmentComponent implements OnInit {
  @Input() listAssessment: Assesment[];
  @Output() revert = new EventEmitter();
  @Output() submitAssessment = new EventEmitter();
  @Output() close = new EventEmitter();
  messageValidateAssessment: string;
  listAssessmentSuggest: Assesment[] = [];
  constructor() { }

  ngOnInit(): void {
    this.listAssessment.map(ass => this.listAssessmentSuggest.push(Object.assign({}, ass)));
  }

  closeModal() {
    this.close.emit();
  }

  submit() {
    if (!this.checkValidMarkAssessment()) return;
    let assessments = [];
    this.listAssessmentSuggest.map(assessment => {
      assessments.push({
        assessment_id: assessment.assessmentId,
        point: assessment.point
      })
    })
    this.submitAssessment.emit(assessments);
  }

  revertSubmit() {
    this.listAssessmentSuggest = [];
    this.listAssessment.map(ass => this.listAssessmentSuggest.push(Object.assign({}, ass)));
    this.revert.emit();
  }

  checkValidMarkAssessment() {
    let sumAssessmentPoint = 0;
    this.listAssessmentSuggest.forEach(assessent => {
      if (assessent.point) {
        sumAssessmentPoint += assessent.point;
      }
    })
    if (sumAssessmentPoint > 100) {
      this.messageValidateAssessment = MESSAGE.SUM_POINT_TOO_MAX;
      return false;
    }

    if (sumAssessmentPoint < 100 && this.listAssessmentSuggest.filter(item => !item.point).length == 0 && sumAssessmentPoint > 0) {
      this.messageValidateAssessment = MESSAGE.SUM_POINT_TOO_MAX;
      return false;
    }
    const markNoPoint = parseInt(parseInt(Number(((100 - Number(sumAssessmentPoint))) / (this.listAssessmentSuggest.filter(item => !item.point).length)).toString()).toFixed(0));
    this.listAssessmentSuggest.forEach(assessment => {
      if (!assessment.point) {
        assessment.point = markNoPoint;
        sumAssessmentPoint += markNoPoint;
      }
    })
    let numberOfSurplus = 100 - sumAssessmentPoint;

    if (this.listAssessmentSuggest.length) {
      for (let i = 0; i <= this.listAssessmentSuggest.length; i++) {
        if (numberOfSurplus > 0) {
          this.listAssessmentSuggest[i].point = this.listAssessmentSuggest[i].point + 1;
          sumAssessmentPoint = sumAssessmentPoint + 1;
          numberOfSurplus = numberOfSurplus - 1;
        } else {
          sumAssessmentPoint = 100;
          break;
        }
      }
    }

    if (this.listAssessmentSuggest.find(assessment => assessment.point == 0)) {
      this.messageValidateAssessment = MESSAGE.POINT_EXIST_ZERO;
      return false;
    }

    if (this.listAssessmentSuggest.filter(item => !item.point).length > 0) {
      return true;
    }
    if (this.listAssessmentSuggest.find(assessment => !assessment.point)) {
      this.messageValidateAssessment = MESSAGE.POINT_EXIST_ZERO;
      return false;
    }

    this.messageValidateAssessment = '';
    return true;
  }

}
