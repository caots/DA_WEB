import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ADD_TIME_EXPIRED_JOB, USER_RESPONSIVE } from 'src/app/constants/config';
import { Assesment } from 'src/app/interfaces/assesment';
import { Job } from 'src/app/interfaces/job';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { AuthService } from 'src/app/services/auth.service';
import { HelperService } from 'src/app/services/helper.service';
import { SubjectService } from 'src/app/services/subject.service';
@Component({
  selector: 'ms-job-card-preview-employer',
  templateUrl: './job-card-preview-employer.component.html',
  styleUrls: ['./job-card-preview-employer.component.scss']
})
export class JobCardPreviewEmployerComponent implements OnInit {
  checkExpired: boolean = false;
  @Output() back = new EventEmitter();
  @Input() jobDetails: Job;
  @Input() isSearchJobPage: boolean;
  @Input() userInfo: UserInfo;
  @Input() isBookMarked: boolean;
  @Input() myAssessments: Array<Assesment>;
  @Output() bookMarkJob = new EventEmitter();
  @Input() activeJob: boolean;
  companyID: number;
  companyLocation: string;
  USER_RESPONSIVE = USER_RESPONSIVE;
  date = new Date();

  constructor(
    private router: Router,
    private authService: AuthService,    
    private subjectService: SubjectService,
    private modalService: NgbModal,
    private helperService: HelperService,
  ) { }

  ngOnInit(): void {
    if (this.checkExpiredTime(this.date, this.jobDetails?.expiredAt)) {
      this.checkExpired = true;
    }
    this.companyID = this.jobDetails?.employerId;
    this.companyLocation = `${this.jobDetails?.cityJob || ''}${this.jobDetails?.cityJob && this.jobDetails?.stateJob ? ', ' + this.jobDetails?.stateJob : (this.jobDetails?.stateJob || '')}`;
  }

  goBack() {
    this.back.emit();
  }

  shareUrl(isViaEmail = 0) {
    const url = `${location.protocol}//${location.host}/job/${this.jobDetails?.urlSeo}`;
    if (!isViaEmail) { return url; }
    const data = `
    I would like to share this job posting on MeasuredSkills with you. Please check out it using the link below.

    ${this.jobDetails?.title} at ${this.userInfo?.companyName}

    ${url}`;
    return data;
  }

  checkExpiredTime(date1: Date, date2: Date) {
    if(!date2) return false;
    const newExpiredJobDate = new Date(date2.getTime());
    return date1 > newExpiredJobDate;
  }

  subDateHotJob(endHotJob: Date){    
    const endDate = moment(endHotJob);
    const nowDate = moment(new Date());
    const days = endDate.diff(nowDate, 'days');
    const hours = endDate.diff(nowDate, 'hours') - days * 24;
    const minus = endDate.diff(nowDate, 'minutes') - days * 24 * 60 - hours * 60;
    return `${days}d ${hours}h ${minus}m`
  }

  subTimeHotJob(endHotJob: Date){
    const timeEndDate = moment(endHotJob).format('LT');
    const MonthEndDate = moment(endHotJob).format('MM/DD');
    const dayEndDate = moment(endHotJob).format('dddd');
    return `${dayEndDate}, ${MonthEndDate} ${timeEndDate}`

  }

}
