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
  selector: 'ms-job-preview-info',
  templateUrl: './job-preview-info.component.html',
  styleUrls: ['./job-preview-info.component.scss']
})
export class JobPreviewInfoComponent implements OnInit {
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
  USER_TYPE = USER_TYPE;
  JOB_PERCENT_TRAVEL_TYPE = JOB_PERCENT_TRAVEL_TYPE;
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
      { bonus: this.jobDetails?.bonus && JSON.parse(this.jobDetails?.bonus) },
      { scheduleJob: this.jobDetails?.scheduleJob && JSON.parse(this.jobDetails?.scheduleJob) },
      { benefits: this.jobDetails?.benefits && this.jobDetails?.benefits.split(',') }
    );

    if (this.jobDetails?.benefits) {
      this.jobDetails?.benefits.map(benefit => {
        const rs = LIST_BENEFITS.find(bens => bens.id === Number.parseInt(benefit));
        if (rs) this.listBenefits.push(rs);
      })
    }

    if (this.jobDetails?.salaryType !== null) {
      const result = SALARY_TYPE.find((slt) => slt.id === this.jobDetails?.salaryType);
      if (result) {
        this.salaryType = result.title;
      }
    }

    if (this.jobDetails?.percentTravel != null) {
      switch (this.jobDetails?.percentTravel) {
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

    this.jobDetails?.listAssessment && this.jobDetails?.listAssessment.map(ass => {
      this.listShowAssessmentCompany.push(Object.assign({}, ass, { pointUser: 0 }));
    });

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

  goBack() {
    this.back.emit();
  }

  colorWeightAssessment(assessment) {
    return this.assessmentService.colorWeightAssessment(assessment.point)
  }

  expiredJob(expiredJob: Date){
    if(!expiredJob) return 'mm-dd-yyyy 12:00 am';
    const date = moment(expiredJob).format('L');
    const time = moment(expiredJob).format('LT');
    return `${date} ${time}`

  }

}
