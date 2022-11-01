import { get } from 'lodash';
import { Router } from '@angular/router';
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import * as moment from 'moment';
import { Assesment } from 'src/app/interfaces/assesment';
import { Job } from 'src/app/interfaces/job';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { SubjectService } from 'src/app/services/subject.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JobService } from 'src/app/services/job.service';
import { HelperService } from 'src/app/services/helper.service';
import { MESSAGE } from 'src/app/constants/message';
import { POINT_VALID_APPLY_JOB, USER_TYPE, ADD_TIME_EXPIRED_JOB, USER_RESPONSIVE, ACTION_FOLLOW } from 'src/app/constants/config';
import { AssessmentService } from 'src/app/services/assessment.service';
import { CardSettings } from 'src/app/interfaces/cardInfo';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
@Component({
  selector: 'ms-job-card-details',
  templateUrl: './job-card-details.component.html',
  styleUrls: ['./job-card-details.component.scss']
})

export class JobCardDetailsComponent implements OnInit {
  @ViewChild('modalApplyJob', { static: true }) modalApplyJob: NgbModalRef;

  user: UserInfo;
  @Input() jobDetails: Job;
  @Input() isSearchJobPage: boolean;
  @Input() jobInfoTab: boolean;
  @Input() userInfo: UserInfo;
  @Input() settingsCard: CardSettings;
  @Input() isBookMarked: boolean;
  @Input() myAssessments: Array<Assesment>;
  @Output() bookMarkJob = new EventEmitter();
  @Output() back = new EventEmitter();
  @Output() add = new EventEmitter();
  listShowAssessmentCompany: any = [];
  isLoadingMyAssessment: boolean;
  companyID: number;
  totalPointWeight = 0;
  listCheckNumberAssessmentJob: any;
  modalApplyJobRef: NgbModalRef;
  checkExpired: boolean;
  date = new Date();
  companyLocation: string;
  routerUrl: string = '';
  USER_RESPONSIVE = USER_RESPONSIVE;
  checkEmployerFollowed: boolean;
  listIdsEmplopyerFollowed: number[];
  isCheckDangerTime: boolean = false;
  isCheckHiddenDangerTime: boolean = false;
  isStayPage: boolean = true;
  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private subjectService: SubjectService,
    private modalService: NgbModal,
    private helperService: HelperService,
    private jobService: JobService,
    private assessmentService: AssessmentService
  ) { }

  ngOnInit(): void {
    this.routerUrl = this.router.url;
    this.subjectService.user.subscribe(user => {
      this.user = user;
    });
    if (this.jobDetails && this.checkExpiredTime(this.date, this.jobDetails?.expiredAt)) {
      this.checkExpired = true;
    }

    this.subjectService.isShowModalApplyJobNoLogin.subscribe(data => {
      if(data && this.isStayPage && this.user){
        const checkNumberAssessmentJob = [];
        const tmpListAssessmentJob = get(this.jobDetails, 'listAssessment', []);
        tmpListAssessmentJob.map(assessmentjob => {
          const myAssessment = this.myAssessments.find(assessment =>
            assessmentjob.assessmentId === assessment.assessmentId && assessment.totalTake);
          if (myAssessment) {
            checkNumberAssessmentJob.push(myAssessment);
          }
        });
        this.listCheckNumberAssessmentJob = checkNumberAssessmentJob;
        this.showModalApplyJob(this.modalApplyJob);
        this.subjectService.isShowModalApplyJobNoLogin.next(false);
      }
    })

    this.subjectService.listIdEmployerFollows.subscribe(data => {
      if (!data) return;
      this.listIdsEmplopyerFollowed = data;
      const index = this.listIdsEmplopyerFollowed.findIndex(id => id == this.jobDetails.employerId);
      if (index >= 0) this.checkEmployerFollowed = true;
    })

    if (!this.isSearchJobPage) {
      this.jobDetails?.listAssessment.map(ass => {
        this.listShowAssessmentCompany.push(Object.assign({}, ass, { pointUser: null }));
      });
      this.onShowListAssessmentJobAssign();
      this.getTotalScoreJobSeeker();
    }
    this.companyID = this.jobDetails.employerId;
    this.companyLocation = `${this.jobDetails.cityName || ''}${this.jobDetails.cityName && this.jobDetails.stateName ? ', ' + this.jobDetails.stateName : (this.jobDetails.stateName || '')}`;
  }

  onCheckValidateScore(modalApplyJob) {
    if (!this.user) { 
      this.isStayPage = false;
      this.subjectService.isShowModalApplyJobNoLogin.next(true);
      return this.router.navigate(['/login']); 
    }
    if (this.user.acc_type == USER_TYPE.EMPLOYER) { return }
    const checkNumberAssessmentJob = [];
    const tmpListAssessmentJob = get(this.jobDetails, 'listAssessment', []);
    tmpListAssessmentJob.map(assessmentjob => {
      const myAssessment = this.myAssessments.find(assessment =>
        assessmentjob.assessmentId === assessment.assessmentId && assessment.totalTake);
      if (myAssessment) {
        checkNumberAssessmentJob.push(myAssessment);
      }
    });
    this.listCheckNumberAssessmentJob = checkNumberAssessmentJob;
    this.showModalApplyJob(modalApplyJob);
  }

  showModalApplyJob(modalApplyJob) {
    if (this.jobDetails) {
      this.modalApplyJobRef = this.modalService.open(modalApplyJob, {
        windowClass: 'modal-apply-job',
        size: 'lg'
      });
      this.notificationService.checkClickApplyJob(this.jobDetails.id).subscribe(()=>{});
    } else {
      this.router.navigate(['/job']);
    }
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

  shareUrl(isViaEmail = 0) {
    const url = `${location.protocol}//${location.host}/job/${this.jobDetails.urlSeo}`;
    if (!isViaEmail) { return url; }
    const data = `
    I would like to share this job posting on MeasuredSkills with you. Please check out it using the link below.

    ${this.jobDetails.title} at ${this.jobDetails.companyName}

    ${url}`;
    return data;
  }

  checkExpiredTime(date1: Date, date2: Date) {
    if(!date2) return false;
    if(date2 < date1) this.isCheckHiddenDangerTime = true;
    const newExpiredJobDate = new Date(date2.getTime() + ADD_TIME_EXPIRED_JOB.JOB_DETAILS);
    return date1 > newExpiredJobDate;
  }

  async drawJob() {
    const isConfirmed = await this.helperService.confirmPopup(MESSAGE.CONFIRM_DRAW_JOB, MESSAGE.BTN_YES_TEXT);
    if (isConfirmed) {
      this.jobService.drawJob(this.jobDetails.id).subscribe(res => {
        this.helperService.showToastSuccess(MESSAGE.DELETE_JOB_SUCCESSFULLY);
        this.add.emit();
        this.jobDetails.is_applied = false;
      }, err => {
        this.helperService.showToastError(err);
      });
    }
  }

  addDrawJob() {
    this.add.emit();
  }

  closeModal() {
    this.modalApplyJobRef.close();
  }

  confirmModal() {
    this.add.emit();
    this.jobDetails.is_applied = true;
    this.modalApplyJobRef.close();
  }

  isApply() {
    return !this.jobDetails.is_applied ? true : false;
  }

  colorWeightAssessment(weight) {
    return this.assessmentService.colorWeightAssessment(weight)
  }

  changeBookMark() {
    if (!this.user) { return this.router.navigate(['/login']); }
    if (this.user.acc_type == USER_TYPE.EMPLOYER) { return }
    this.bookMarkJob.emit()
  }

  followEmployer(status) {
    const action = status ? ACTION_FOLLOW.unfollow : ACTION_FOLLOW.follow;
    if (action == ACTION_FOLLOW.unfollow) this.onUnFollow(action, status);
    else this.onToggleFollowEmolyer(action, status);
  }

  goToLogin() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  async onUnFollow(action, status) {
    const isConfirmed = await this.helperService.confirmPopup(`Are you sure you want to unfollow ${this.jobDetails.companyName}?`, MESSAGE.BTN_YES_TEXT);
    if (isConfirmed) {
      this.onToggleFollowEmolyer(action, status);
    }
  }

  onToggleFollowEmolyer(action, status) {
    if (!this.user){
      this.goToLogin();
      return;
    }
    this.jobService.followEmployer(this.companyID, action).subscribe(data => {
      this.helperService.showToastSuccess(action == ACTION_FOLLOW.follow ? MESSAGE.UPDATE_FOLLOW_SUCCESSFULY : MESSAGE.UPDATE_UNFOLLOW_SUCCESSFULY);
      this.checkEmployerFollowed = !status;
      this.jobService.getListIdCompanyFollowed().subscribe();
    }, err => {
      this.helperService.showToastError(err);
    })
  }

  subDateHotJob(endHotJob: Date){    
    const endDate = moment(endHotJob);
    const nowDate = moment(new Date());
    const days = endDate.diff(nowDate, 'days');
    const hours = endDate.diff(nowDate, 'hours') - days * 24;
    const minus = endDate.diff(nowDate, 'minutes') - days * 24 * 60 - hours * 60;
    if(days == 0 && hours < 6) this.isCheckDangerTime = true;
    return `${days}d ${hours}h ${minus}m`
  }

  subTimeHotJob(endHotJob: Date){
    const timeEndDate = moment(endHotJob).format('LT');
    const MonthEndDate = moment(endHotJob).format('MM/DD');
    const dayEndDate = moment(endHotJob).format('dddd');
    return `${dayEndDate}, ${MonthEndDate} ${timeEndDate}`

  }
}
