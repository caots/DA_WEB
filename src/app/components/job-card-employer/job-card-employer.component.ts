import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PermissionService } from 'src/app/services/permission.service';
import { MODE, JOB_STATUS, PERMISSION_TYPE } from 'src/app/constants/config';
import { Job } from 'src/app/interfaces/job';
import { SubjectService } from 'src/app/services/subject.service';
import { Subscription } from 'rxjs';
import { JobService } from 'src/app/services/job.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ms-job-card-employer',
  templateUrl: './job-card-employer.component.html',
  styleUrls: ['./job-card-employer.component.scss']
})

export class JobCardEmployerComponent implements OnInit, OnDestroy {
  @Input() job: Job;
  @Input() activeTab: string;
  @Input() mode: string;
  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() makeActiveDraf = new EventEmitter();
  @Output() upgradeJob = new EventEmitter();
  @Output() makeActiveClose = new EventEmitter();
  @Output() copyOutput = new EventEmitter();
  @Output() comment = new EventEmitter();
  @Output() showModaAddNumbersApplicants = new EventEmitter();
  subscription: Subscription = new Subscription();
  cardMode = MODE;
  statusJob: string;
  jobDesc: string;
  userData: any;
  viewMoreBtn: boolean;
  viewLessBtn: boolean;
  permission = PERMISSION_TYPE;
  jobStatus = TAB_TYPE;
  constructor(
    public router: Router,
    public jobService: JobService,
    public permissionService: PermissionService,
    public subjectService: SubjectService,
  ) { }

  ngOnInit(): void {
    this.handleOnSocketSubscription();
    this.onSetStatusJob();
    this.jobDesc = this.job.description;
    this.viewMoreBtn = false;
    this.viewLessBtn = false;
    this.viewLessDesc();
  }

  generateLinkPrivteJob(job: Job) {
    if (job.isPrivate == 1) {
      return this.jobService.generateLinkPrivateJob(job)
    }
    return '';
  }

  shareUrl(isViaEmail = 0) {
    const url = `${location.protocol}//${location.host}/job/${this.job.urlSeo}`;
    if (!isViaEmail) { return url; }
    const data = `
    I would like to share this job posting on MeasuredSkills with you. Please check out it using the link below.

    ${this.job.title} at ${this.userData?.companyName}

    ${url}`;
    return data;
  }

  copyClipboard(jobId: number) {
    let copyText: any = document.getElementById(`privateLink-${jobId}`);
    copyText.select();
    copyText.setSelectionRange(0, 99999)
    document.execCommand("copy");
  }

  handleOnSocketSubscription() {
    // on received message
    const handlesubjectService = this.subjectService.user.subscribe(user => {
      if (!user) { return }
      this.userData = user;
    })
    this.subscription.add(handlesubjectService);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
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

  viewMoreDesc() {
    this.jobDesc = this.job.description;
    this.viewMoreBtn = false;
    this.viewLessBtn = true;
  }

  getAvailableApplicantNumber(job: Job) {
    if (!job.privateApplicants) job.privateApplicants = 0;
    if (!job.totalApplicants) job.totalApplicants = 0;
    return job.privateApplicants - job.totalApplicants;
  }

  onSetStatusJob() {
    switch (this.job.status) {
      case JOB_STATUS.Active: {
        this.statusJob = this.job.isPrivate != 1 ? 'Upgrade' : 'Activate';
        break;
      }
      case JOB_STATUS.UnPaid: {
        this.statusJob = 'Activate'
        break;
      }
      case JOB_STATUS.Draft: {
        this.statusJob = 'Activate'
        break;
      }
      case JOB_STATUS.Closed: {
        this.statusJob = 'Closed'
        break;
      }
    }
  }

  editJob() {
    this.edit.emit(this.job);
  }

  deleteJob() {
    this.delete.emit(this.job);
  }

  copyJob() {
    this.copyOutput.emit(this.job);
  }

  commentJob() {
    this.comment.emit(this.job.id);
  }

  postDrafJob() {
    if (this.job.status === JOB_STATUS.UnPaid || this.job.status === JOB_STATUS.Draft) {
      this.makeActiveDraf.emit(this.job);
    }
    if (this.job.status === JOB_STATUS.Active && this.job.isPrivate != 1 && this.activeTab !== this.jobStatus.CLOSE) {
      this.upgradeJob.emit(this.job);
    }
    if (this.activeTab == this.jobStatus.CLOSE) {
      this.makeActiveClose.emit(this.job);
    }
  }

  showModaAddApplicantsIntoPrivateJob() {
    this.showModaAddNumbersApplicants.emit(this.job);
  }

  goToPreviewJob(job) {
    if(this.activeTab == this.jobStatus.ACTIVE) this.router.navigate(['/preview-employer'], { queryParams: { id: job.id, searchJob: true, activeJob: true } });
    else this.router.navigate(['/preview-employer'], { queryParams: { id: job.id, searchJob: true } });
  }
}

const TAB_TYPE = {
  ACTIVE: '',
  CLOSE: 'expired',
  DRAFT: 'draft'
}
