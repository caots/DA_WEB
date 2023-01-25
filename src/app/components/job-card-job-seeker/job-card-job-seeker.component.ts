import { get } from 'lodash';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

import { JobService } from 'src/app/services/job.service';
import { HelperService } from 'src/app/services/helper.service';
import { MESSAGE } from 'src/app/constants/message';
import { Assesment } from 'src/app/interfaces/assesment';
import { AssessmentService } from 'src/app/services/assessment.service';
import { TAB_DASHBOARD_JOBSEEKER, APPLICANT_STAGE, SEARCH_GROUP_TYPE, ADD_TIME_EXPIRED_JOB, ACTION_FOLLOW, USER_RESPONSIVE, USER_TYPE } from 'src/app/constants/config';
import { SubjectService } from 'src/app/services/subject.service';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { CardSettings } from 'src/app/interfaces/cardInfo';
import { Job } from 'src/app/interfaces/job';
import { AuthService } from 'src/app/services/auth.service';
import { SearchJobJobSeeker } from 'src/app/interfaces/search';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'ms-job-card-job-seeker',
  templateUrl: './job-card-job-seeker.component.html',
  styleUrls: ['./job-card-job-seeker.component.scss']
})

export class JobCardJobSeekerComponent implements OnInit {
  @Input() job: Job;
  @Input() query: SearchJobJobSeeker;
  @Input() isBookmark: boolean;
  @Input() settingsCard: CardSettings;
  @Input() myAssessments: Array<Assesment>;
  @Input() tab: any;
  @Input() condition: any;
  @Output() apply = new EventEmitter();
  @Output() bookmark = new EventEmitter();
  @Output() add = new EventEmitter();
  modalApplyJobRef: NgbModalRef;
  modalValidatedAssessmentsRef: NgbModalRef;
  modalTakeAssessmentRef: NgbModalRef;
  isApplied = false;
  modalRef: any;
  stageName: any;
  checkExpired: boolean;
  date = new Date();
  listCheckNumberAssessmentJob: any;
  listShowAssessmentCompany: any = [];
  totalPointWeight = 0;
  userData: UserInfo;
  TAB_DASHBOARD_JOBSEEKER = TAB_DASHBOARD_JOBSEEKER;
  listStages: any[] = APPLICANT_STAGE;
  USER_RESPONSIVE = USER_RESPONSIVE;
  salaryType: string;
  isCompensation: boolean;
  checkEmployerFollowed: boolean = false;
  listIdsEmplopyerFollowed: any[];
  jobDesc: string;
  viewMoreBtn: boolean;
  viewLessBtn: boolean;
  isCheckHiddenDangerTime: boolean = false;
  isCheckDangerTime: boolean = false;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private helperService: HelperService,
    private subjectService: SubjectService,
    public jobService: JobService,
    private authService: AuthService,
    private assessmentService: AssessmentService,
    private notificationService: NotificationService
  ) {
    this.isBookmark = false;
  }

  ngOnInit(): void {
    const index = this.listStages.findIndex(element => element.id === this.job.stage);
    this.stageName = this.listStages[index];
    this.jobDesc = this.job.description;
    this.viewMoreBtn = false;
    this.viewLessBtn = false;
    this.viewLessDesc();
    if (this.checkExpiredTime(this.date, this.job.expiredAt)) {
      this.checkExpired = true;
    }
    if (this.tab == 'applied') {
      this.isApplied = true;
    }
    this.subjectService.user.subscribe(user => {
      this.userData = user;
    });
    this.subjectService.listIdEmployerFollows.subscribe(data => {
      if (!data) return;
      this.listIdsEmplopyerFollowed = data;
      const index = this.listIdsEmplopyerFollowed.findIndex(id => id == this.job.employerId);
      this.checkEmployerFollowed = index >= 0;
    });
    this.job.listAssessment.map(ass => {
      this.listShowAssessmentCompany.push(Object.assign({}, ass, { pointUser: null }));
    });
    this.onShowListAssessmentJobAssign();
    this.getTotalScoreJobSeeker();
    this.salaryType = this.jobService.switchSalaryType(this.job.salaryType);
    this.isCompensation = this.jobService.switchProposedCompensation(this.job.proposedConpensation);
  }

  getTotalScoreJobSeeker() {
    this.job.listAssessment.map(assessmentjob => {
      this.myAssessments.map(myAss => {
        if (assessmentjob.assessmentId === myAss.assessmentId && myAss.weight != null) {
          this.totalPointWeight += (myAss.weight * assessmentjob.point) / 100;
        }
      });
    });
    this.totalPointWeight = parseInt(this.totalPointWeight.toFixed(0));
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

  applyJob() {
    this.apply.emit(this.job);
  }

  checkExpiredTime(date1, date2) {
    if (date2 < date1) this.isCheckHiddenDangerTime = true;
    return date1 > date2;
  }

  bookmarkJob() {
    this.bookmark.emit({
      status: this.isBookmark,
      id: this.job.id
    });
  }

  shareUrl(isViaEmail = 0) {
    const url = `${location.protocol}//${location.host}/job/${this.job.urlSeo}`;
    if (!isViaEmail) { return url; }
    const data = `
    I would like to share this job posting on MeasuredSkills with you. Please check out it using the link below.

    ${this.job.title} at ${this.job.companyName}

    ${url}`;
    return data;
  }

  onCheckValidateScore(modalApplyJob) {
    if (!this.userData || this.userData.acc_type !== USER_TYPE.JOB_SEEKER) {
      this.subjectService.isShowModalApplyJobNoLogin.next({ url: `/job/${this.job.urlSeo}` });
      return this.router.navigate(['/login']);
    }
    const checkNumberAssessmentJob = [];
    const tmpListAssessmentJob = get(this.job, 'listAssessment', []);
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
    if (this.job) {
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
      size: 'md'
    });
  }

  async drawJob() {
    const isConfirmed = await this.helperService.confirmPopup(MESSAGE.CONFIRM_DRAW_JOB, MESSAGE.BTN_YES_TEXT);
    if (isConfirmed) {
      this.jobService.drawJob(this.job.id).subscribe(res => {
        this.helperService.showToastSuccess(MESSAGE.DELETE_JOB_CLOSE_SUCCESSFULLY);
        this.add.emit();
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

  closeModalValidatedAssessments() {
    this.modalValidatedAssessmentsRef.close();
  }

  confirmModal() {
    this.add.emit();
    this.modalApplyJobRef.close();
  }

  isApply() {
    return !this.job.is_applied ? true : false;
  }

  colorWeightAssessment(weight) {
    return this.assessmentService.colorWeightAssessment(weight)
  }

  showModalTakeAssessments(modalTakeAssessment) {
    this.modalTakeAssessmentRef = this.modalService.open(modalTakeAssessment, {
      windowClass: 'modal-take-assessments',
      size: 'lg'
    });
  }
  viewMessage() {
    // this.router.navigate([route, msg.group_id, jobId])
    this.router.navigate(['/messages'], {
      queryParams: {
        groupId: this.job.group_id,
        searchType: SEARCH_GROUP_TYPE.All,
        q: this.job.title,
        isGroup: '1'
      }
    });
  }

  followEmployer(status) {
    const action = status ? ACTION_FOLLOW.unfollow : ACTION_FOLLOW.follow;
    if (action == ACTION_FOLLOW.unfollow) this.onUnFollow(action, status);
    else this.onToggleFollowEmolyer(action, status);
  }

  async onUnFollow(action, status) {
    const isConfirmed = await this.helperService.confirmPopup(`Are you sure you want to unfollow ${this.job.companyName}?`, MESSAGE.BTN_YES_TEXT);
    if (isConfirmed) {
      this.onToggleFollowEmolyer(action, status);
    }
  }

  goToLogin() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onToggleFollowEmolyer(action, status) {
    if (!this.userData || this.userData.acc_type !== USER_TYPE.JOB_SEEKER) {
      this.goToLogin();
      return;
    }
    this.jobService.followEmployer(this.job.employerId, action).subscribe(data => {
      this.helperService.showToastSuccess(action == ACTION_FOLLOW.follow ? MESSAGE.UPDATE_FOLLOW_SUCCESSFULY : MESSAGE.UPDATE_UNFOLLOW_SUCCESSFULY);
      this.checkEmployerFollowed = !status;
    }, err => {
      this.helperService.showToastError(err);
    })
  }

  viewLessDesc() {
    if (this.job.description) {
      if (Number(this.job.description.length) > 200) {
        this.jobDesc = this.jobDesc.slice(0, 200) + '...';
        this.viewMoreBtn = true;
        this.viewLessBtn = false;
      } else {
        this.viewMoreBtn = false;
      }
    }
  }

  subDateHotJob(endHotJob: Date) {
    const endDate = moment(endHotJob);
    const nowDate = moment(new Date());
    const days = endDate.diff(nowDate, 'days');
    const hours = endDate.diff(nowDate, 'hours') - days * 24;
    const minus = endDate.diff(nowDate, 'minutes') - days * 24 * 60 - hours * 60;
    if (days == 0 && hours < 6) this.isCheckDangerTime = true;
    return `${days}d ${hours}h ${minus}m`
  }

  subTimeHotJob(endHotJob: Date) {
    const timeEndDate = moment(endHotJob).format('LT');
    const MonthEndDate = moment(endHotJob).format('MM/DD');
    const dayEndDate = moment(endHotJob).format('dddd');
    return `${dayEndDate}, ${MonthEndDate} ${timeEndDate}`

  }

  viewMoreDesc() {
    this.jobDesc = this.job.description;
    this.viewMoreBtn = false;
    this.viewLessBtn = true;
  }

}
