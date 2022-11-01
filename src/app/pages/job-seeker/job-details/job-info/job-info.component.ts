import { Router } from '@angular/router';
import * as moment from 'moment';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { formatCurrency, getCurrencySymbol } from '@angular/common';

import { Assesment } from 'src/app/interfaces/assesment';
import { Job } from 'src/app/interfaces/job';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { SubjectService } from 'src/app/services/subject.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JobService } from 'src/app/services/job.service';
import { HelperService } from 'src/app/services/helper.service';
import { MESSAGE } from 'src/app/constants/message';
import { JOB_PERCENT_TRAVEL_TYPE, PERCENT_TRAVEL, LIST_BENEFITS, USER_TYPE, EMPLOYMENT_TYPE, SALARY_TYPE } from 'src/app/constants/config';
import { AssessmentService } from 'src/app/services/assessment.service';

@Component({
  selector: 'ms-job-info',
  templateUrl: './job-info.component.html',
  styleUrls: ['./job-info.component.scss']
})
export class JobInfoComponent implements OnInit {
  user: UserInfo;
  @Input() jobDetails: Job;
  @Input() listJobsFormEmployer: Job;
  @Input() myAssessments: Array<Assesment>;
  @Output() back = new EventEmitter();
  modalReportJobRef: NgbModalRef;
  listShowAssessmentCompany: any = [];
  isLoadingMyAssessment: boolean;
  totalPointWeight = 0;
  listCheckNumberAssessmentJob: any;
  modalValidatedAssessmentsRef: NgbModalRef;
  modalApplyJobRef: NgbModalRef;
  checkExpired: boolean;
  date = new Date();
  companyID: number;
  jobId: number;
  percenTravel: string;
  JOB_PERCENT_TRAVEL_TYPE = JOB_PERCENT_TRAVEL_TYPE;
  USER_TYPE = USER_TYPE;
  companyLocation: string;
  listBenefits: any[] = [];
  salaryType: string;
  constructor(
    private router: Router,
    private subjectService: SubjectService,
    private modalService: NgbModal,
    private helperService: HelperService,
    private jobService: JobService,
    private assessmentService: AssessmentService
  ) { }

  ngOnInit(): void {
    this.subjectService.user.subscribe(user => {
      this.user = user;
    });
    this.jobDetails = Object.assign({}, this.jobDetails,
      { bonus: this.jobDetails.bonus && JSON.parse(this.jobDetails.bonus) },
      { scheduleJob: this.jobDetails.scheduleJob && JSON.parse(this.jobDetails.scheduleJob) },
      { benefits: this.jobDetails.benefits && this.jobDetails.benefits.split(',') }
    );

    if (this.jobDetails.benefits) {
      this.jobDetails.benefits.map(benefit => {
        const rs = LIST_BENEFITS.find(bens => bens.id === Number.parseInt(benefit));
        if (rs) this.listBenefits.push(rs);
      })
    }

    if (this.jobDetails.salaryType !== null) {
      const result = SALARY_TYPE.find((slt) => slt.id === this.jobDetails.salaryType);
      if (result) {
        this.salaryType = result.title;
      }
    }

    if (this.jobDetails.percentTravel != null) {
      switch (this.jobDetails.percentTravel) {
        case PERCENT_TRAVEL.ONSITE:
          this.percenTravel = "On-site"
          break;
        case PERCENT_TRAVEL.REMOTE:
          this.percenTravel = "Remote"
          break;
        case PERCENT_TRAVEL.HYBRID:
          this.percenTravel = "Hybrid On-site/Remote"
          break;
        default:
          break;
      }
    }

    if (this.checkExpiredTime(this.date, this.jobDetails.expiredAt) > 0) {
      this.checkExpired = true;
    }
    this.jobDetails?.listAssessment.map(ass => {
      this.listShowAssessmentCompany.push(Object.assign({}, ass, { pointUser: 0 }));
    });

    this.onShowListAssessmentJobAssign();
    this.getTotalScoreJobSeeker();
    this.companyID = this.jobDetails.employerId;
    this.jobId = this.jobDetails.id;
    this.genCompanyLocation();
    
  }
  genCompanyLocation() {
    const array = [];
    if (this.jobDetails.address) { array.push(this.jobDetails.address); }
    if (this.jobDetails.cityName) { array.push(this.jobDetails.cityName); }
    if (this.jobDetails.stateName) { array.push(this.jobDetails.stateName); }
    if (array.length > 0) { 
      this.companyLocation = array.join(', ');
    }
  }
  onCheckValidateScore(modalApplyJob, modalValidatedAssessments) {
    let totalWeight = 0;
    const checkNumberAssessmentJob = [];
    const tmpListAssessmentJob = this.jobDetails.listAssessment;
    tmpListAssessmentJob.map(assessmentjob => {
      this.myAssessments.map(myAss => {
        if (assessmentjob.assessmentId === myAss.assessmentId && myAss.weight != null) {
          checkNumberAssessmentJob.push({
            assessmentId: assessmentjob.assessmentId,
            point: myAss.weight?.toFixed(0),
          });
          totalWeight += (myAss.weight * assessmentjob.point) / 100;
        }
      });
    });
    if (checkNumberAssessmentJob.length != this.jobDetails.listAssessment.length) {
      this.listCheckNumberAssessmentJob = checkNumberAssessmentJob;
      this.showModalValidatedAssessments(modalValidatedAssessments);
      return;
    }
    this.showModalApplyJob(modalApplyJob);
  }

  showModalApplyJob(modalApplyJob) {
    if (this.jobDetails) {
      this.modalApplyJobRef = this.modalService.open(modalApplyJob, {
        windowClass: 'modal-apply-job',
        size: 'lg'
      });
    } else {
      this.router.navigate(['/job']);
    }
  }

  showModalValidatedAssessments(modalValidatedAssessments) {
    this.modalValidatedAssessmentsRef = this.modalService.open(modalValidatedAssessments, {
      windowClass: 'modal-validated-assessments modal-center-screen',
      size: 'lg'
    });
  }

  goBack() {
    this.back.emit();
  }

  onShowListAssessmentJobAssign() {
    this.listShowAssessmentCompany.map(ass => {
      this.myAssessments.map(myAss => {
        if (myAss.assessmentId === ass.assessmentId) {
          ass.pointUser = myAss.weight?.toFixed(0);
        }
      });
    });
  }

  getTotalScoreJobSeeker() {
    this.jobDetails.listAssessment.map(assessmentjob => {
      this.myAssessments.map(myAss => {
        if (assessmentjob.assessmentId === myAss.assessmentId && myAss.weight != null) {
          this.totalPointWeight += (myAss.weight * assessmentjob.point) / 100;
        }
      });
    });
    this.totalPointWeight = parseInt(this.totalPointWeight?.toFixed(0));
  }

  checkExpiredTime(date1, date2) {
    const diff = Math.abs(date1 - date2);
    return diff;
  }

  closeModal() {
    this.modalApplyJobRef.close();
  }


  isApply() {
    if (!this.jobDetails.is_applied && this.checkExpired) {
      return true;
    }
    return false;
  }

  colorWeightAssessment(assessment) {
    const index = this.myAssessments.findIndex(myAss => myAss.assessmentId === assessment.assessmentId);
    const weight = index >= 0 ? this.myAssessments[index].weight : null;
    return this.assessmentService.colorWeightAssessment(weight)
  }

  async showModalReportJob(modalReportJob) {
    if (this.user) {
      this.modalReportJobRef = this.modalService.open(modalReportJob, {
        windowClass: 'modal-report-company',
        size: 'l'
      })
    } else {
      this.router.navigate(['/login']);
    }
  }

  expiredJob(expiredJob: Date){
    const date = moment(expiredJob).format('L');
    const time = moment(expiredJob).format('LT');
    return `${date} ${time}`

  }

}
