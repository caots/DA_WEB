import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { NgbModal, NgbModalRef, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { ASSESSMENTS_CUSTOM_CONFIG, ASSESSMENTS_TYPE, CUSTOM_ASSESSMENT_INTRUCTION_TEXT, QESTION_CUSTOME_ASSESSMENT, TIME_COUNTER } from 'src/app/constants/config';
import { ResultCustumAssessment } from 'src/app/interfaces/assesment';
import { DataUpdate } from 'src/app/interfaces/questionCustomAssessment';
import { AssessmentService } from 'src/app/services/assessment.service';
import { HelperService } from 'src/app/services/helper.service';
import { PreviousRouteService } from 'src/app/services/previous-route.service';
import * as moment from 'moment';
import { Job } from 'src/app/interfaces/job';
@Component({
  selector: 'ms-test-assessment',
  templateUrl: './test-assessment.component.html',
  styleUrls: ['./test-assessment.component.scss']
})
export class TestAssessmentComponent implements OnInit, OnDestroy {
  customAssessment: DataUpdate = new DataUpdate();
  isLoading: boolean;
  isLoadingSubmit: boolean;
  timeOut: string;
  listQuestionCustomAssessment = QESTION_CUSTOME_ASSESSMENT;
  customAssessmentId: number;
  resultAssessment: ResultCustumAssessment;
  checkOutLoop: boolean = false;
  isSubmitData: boolean = false;
  modalResultCustomAssessmentRef: NgbModalRef;
  isTimeUp: boolean = false;
  countDown: any;
  isSticky: boolean = false;
  isAssessmentPage: boolean;
  countDownDate: number;
  timeUp: string;
  jobInfo: Job;
  jobDashboard: any;

  constructor(
    private router: Router,
    private config: NgbModalConfig,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private assessmentService: AssessmentService,
    private helperService: HelperService,
    private previousRouteService: PreviousRouteService,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    window.onbeforeunload = function(ev) {
      ev.preventDefault();
      ev.returnValue = 'prevented';
      return 'prevented';
    };
    this.scrollTop();
    if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.customAssessmentId = state.assessmentId;
      this.customAssessment = state.customAssessment;
      this.isAssessmentPage = state.isAssessmentPage || false;
      this.jobInfo = state.jobInfo;
      this.jobDashboard = state.jobDashboard;
      this.isLoading = false;
      this.setTimeOutDuration();
    } else {
      this.router.navigate(['/job']);
    }
    console.log(this.customAssessmentId);
  }
  scrollTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }
  ngOnInit(): void {
  }
  ngOnDestroy() {
  }

  setTimeOutDuration() {
    const timeLimit = this.customAssessment.duration ? this.customAssessment.duration : ASSESSMENTS_CUSTOM_CONFIG.TimeLimit;
    this.countDownDate = moment().add(timeLimit, 'minutes').add(2,'seconds').valueOf();
    this.countDown = setInterval(() => {

      // Get today's date and time
      const now = new Date().getTime();
    
      // Find the distance between now and the count down date
      const distance = this.countDownDate - now;
    
      // Time calculations for days, hours, minutes and seconds
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(this.countDown);
        this.isTimeUp = true;
        this.submitTestResult();
        return;
      } 
      this.timeOut = `${hours}h ${minutes}m ${seconds}s`;
      this.isTimeUp = false;
    }, 1000);
  }

  submitTestResult(){
    this.isTimeUp = true;
    document.getElementById("btn-submitResult").click();
  }

  submitTest(modalResultCustomAssessment = null) {
    let answerList = [];
    this.customAssessment.questionList.map(question => {
      let optionsAnswer = {
        question_id: question.id,
        answer: []
      }
      if (question.type == this.listQuestionCustomAssessment.SINGLE_TEXTBOX) {
        optionsAnswer.answer.push(question.answers)
      } else {
        question.answers.map((a, index) => {
          if (a.status == true) { optionsAnswer.answer.push(index) }
        })
      }
      answerList.push(optionsAnswer);
    });
    const body = { answerList: answerList };

    if (!this.isSubmitData) {
      this.isSubmitData = true;
      this.submitCustomAssessment(body, modalResultCustomAssessment);
    }
  }

  goToResult(modalResultCustomAssessment){
    this.modalResultCustomAssessmentRef = this.modalService.open(modalResultCustomAssessment, {
      windowClass: 'modal-top-up',
      size: 'md'
    })
  }

  submitCustomAssessment(body, modalResultCustomAssessment) {
    this.isLoadingSubmit = true;
    this.assessmentService.submitCustomAssessment(body, this.customAssessmentId, ASSESSMENTS_TYPE.Custom, this.customAssessment)
      .subscribe((data: ResultCustumAssessment) => {
        this.resultAssessment = data;
        this.isLoadingSubmit = false;
        this.goToResult(modalResultCustomAssessment);
        clearInterval(this.countDown);
      }, err => {
        this.isLoadingSubmit = false;
        this.helperService.showToastError(err);
      })
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 170;
    //console.log("this.isSticky", this.isSticky);
    
  }

  

}
