import * as moment from 'moment';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { SubjectService } from 'src/app/services/subject.service';
import { AssessmentService } from 'src/app/services/assessment.service';
import { ASSESSMENTS_TYPE } from 'src/app/constants/config';
import { Assesment, AssessmentHistory } from 'src/app/interfaces/assesment';
import { HelperService } from 'src/app/services/helper.service';
import { CardSettings } from 'src/app/interfaces/cardInfo';

@Component({
  selector: 'ms-assessments-card',
  templateUrl: './assessments-card.component.html',
  styleUrls: ['./assessments-card.component.scss']
})
export class AssessmentsCardComponent implements OnInit {
  @Input() isAddAssessment: boolean;
  @Input() userData: UserInfo;
  @Input() isSelected: boolean;
  @Input() assessment: any;
  @Input() settingsCard: CardSettings;
  @Input() isAdding: boolean;
  @Output() add = new EventEmitter();
  @Output() remove = new EventEmitter();
  @Output() validate = new EventEmitter();
  @Output() payment = new EventEmitter();
  @Output() retry = new EventEmitter();
  subscription: Subscription = new Subscription();
  assessmentType = ASSESSMENTS_TYPE;
  historyAssessments: AssessmentHistory[];
  constructor(
    private subjectService: SubjectService,
    private helperService: HelperService,
    public assessmentService: AssessmentService
  ) { }

  ngOnInit(): void {
    if (this.assessment.weight !== null && !isNaN(this.assessment.weight)) {
      this.assessment.weight = parseInt(this.assessment.weight?.toFixed(0));
    }
    this.handleOnSocketSubscription();
  }

  getFreeASttemptsRemaining(assessment: Assesment) {
    if (!assessment.totalTake) return this.settingsCard.free_assessment_validation || 0;
    const nmberOfFree = this.settingsCard.free_assessment_validation - assessment.totalTake;
    return nmberOfFree > 0 ? nmberOfFree : 0
  }

  getHistoryAssessment() {
    const params = this.assessment.assessmentId ? this.assessment.assessmentId : this.assessment.assessment_id;
    this.assessmentService.getAssessmentHistory(params).subscribe(data => {
      this.historyAssessments = data;
    }, err => {
      this.helperService.showToastError(err);
    });
  }

  isCheckTotalTakeAssessment() {
    return this.assessmentService.checkRetryCustomAssessment(this.assessment);
  }

  handleOnSocketSubscription() {
    // on received message
    const handlesubjectService = this.subjectService.user.subscribe(user => {
      if (!user) { return }
      this.userData = user;
    })
    this.subscription.add(handlesubjectService);
  }

  addToAssessment() {
    this.add.emit(this.assessment);
  }

  removeToAssessment() {
    this.remove.emit(this.assessment);
  }

  validateAssessment() {
    // const nbrCredits = get(this.userData, 'nbrCredits', 0);
    // const nbrFreeCredits = get(this.userData, 'nbrFreeCredits', 0);
    // let numberTest = nbrCredits + nbrFreeCredits;
    // numberTest > 0 ? this.validate.emit(this.assessment);
    this.validate.emit(this.assessment);
  }

  retryAssessment() {
    // const nbrCredits = get(this.userData, 'nbrCredits', 0);
    // const nbrFreeCredits = get(this.userData, 'nbrFreeCredits', 0);
    // let numberTest = nbrCredits + nbrFreeCredits;
    // numberTest > 0 ? this.retry.emit(this.assessment) : this.payment.emit(this.assessment);
    this.retry.emit(this.assessment);
  }

  isRetry() {
    return this.assessment.totalTake;
  }

  isPoint() {
    if (this.assessment.weight !== null && !isNaN(this.assessment.weight)) {
      return true;
    } else {
      return false;
    }
  }
  showHistory(assessment: Assesment) {
    this.assessment.selectedShowHistory = !this.assessment.selectedShowHistory;
    if (this.assessment.selectedShowHistory) {
      this.getHistoryAssessment();
    }
  }

  formateDateAssessmentHistory(dateUtc) {
    let utcTime = dateUtc.toString().replace('T', " ");
    const stillUtc = moment.utc(utcTime).toDate();
    return moment(stillUtc).local().format('MM/DD/YYYY h:mm a');
  }
}

