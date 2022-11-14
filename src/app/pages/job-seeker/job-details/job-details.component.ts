import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Assesment } from 'src/app/interfaces/assesment';
import { BOOKMARK_CONFIG, JOB_ORDER, USER_TYPE } from 'src/app/constants/config';
import { Job } from 'src/app/interfaces/job';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { JobService } from 'src/app/services/job.service';
import { CeoService } from 'src/app/services/ceo.service';
import { HelperService } from 'src/app/services/helper.service';
import { SubjectService } from 'src/app/services/subject.service';
import { AssessmentService } from 'src/app/services/assessment.service';
import { UserService } from 'src/app/services/user.service';
import { PaymentService } from 'src/app/services/payment.service';
import { CardSettings } from 'src/app/interfaces/cardInfo';
import { AuthService } from 'src/app/services/auth.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'ms-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})

export class JobDetailsComponent implements OnInit {
  @ViewChild('modalAlert', { static: true }) modalAlert: NgbModalRef;
  user: UserInfo;
  jobDetails: Job;
  listJobsFormEmployer: Job;
  isCallingApi: boolean;
  isBookmarked: boolean;
  listBookmark: number[];
  listShowAssessmentCompany: any = [];
  isLoadingMyAssessment: boolean;
  listMyAssessment: Array<Assesment> = [];
  jobInfoTab: boolean;
  companyInfoTab: boolean;
  settingsCard: CardSettings;
  isSearchJobPage: boolean;
  noHistoryStage: boolean;
  isLogViewCompany: boolean;
  modalAlertRef: NgbModalRef;

  constructor(
    private authService: AuthService,
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private jobService: JobService,
    private ceoService: CeoService,
    private helperService: HelperService,
    private subjectService: SubjectService,
    private assessmentService: AssessmentService,
    private userService: UserService,
    private paymentService: PaymentService,
    private modalService: NgbModal,

  ) {
    this.isBookmarked = false;
    if (!this.router.getCurrentNavigation() || !this.router.getCurrentNavigation().extras) { return; }
    const state = this.router.getCurrentNavigation().extras.state;
    if (state && state.apply) {
      //console.log('open apply');
      this.openApplyModal();
      this.noHistoryStage = true;
    }
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['tab'] === 'employer') {
        this.companyInfoTab = true;
        this.jobInfoTab = false;
      } else {
        this.companyInfoTab = false;
        this.jobInfoTab = true;
      }
      if (params && params.apply && !params.showAlert) {
        //console.log('open apply');
        this.openApplyModal();
        // Remove query params
        this.router.navigate([], {
          queryParams: {
            'apply': null,
          },
          queryParamsHandling: 'merge'
        })
        // const query = `applynull`;
        // let currentUrl = this.previousRouteService.getCurrentUrl();
        // currentUrl = currentUrl.replace('?apply=true', '');
        this.noHistoryStage = true;
        // this.previousRouteService.replaceStage(currentUrl);
      }
      if (params && params.searchJob) this.isSearchJobPage = true;
      if (params && params.showAlert) {
        this.showModalAlert(this.modalAlert);
        this.reloadPageWhenWaitTakeTest();
      }

    })

    this.isCallingApi = true;

    this.subjectService.user.subscribe(user => {
      this.user = user;
      if (this.user?.acc_type == USER_TYPE.EMPLOYER) {
        this.user = null;
        this.authService.logout();
      }
    })

    if (this.user && this.user.acc_type == USER_TYPE.JOB_SEEKER) this.getMyAssessment();
    this.userService.assessment.subscribe(assessment => {
      if (assessment) {
        let assessmentSocket = this.listMyAssessment.filter(obj => {
          return (obj.assessmentId == assessment.assessment_id && obj.type == assessment.assessment_type)
        });
        this.listMyAssessment[this.listMyAssessment.indexOf(assessmentSocket[0])].weight = assessment?.weight;
        this.listMyAssessment[this.listMyAssessment.indexOf(assessmentSocket[0])].totalTake = assessment?.totalTake;
        this.router.navigate([]);
        this.getMyAssessment();
      }
    })

    this.activatedRoute.paramMap.subscribe(params => {
      const url = params.get('slug');
      if (url) {
        if (!this.isSearchJobPage) this.getJobDetail(url);
        else this.getCompanyDetails(url);
      }
    })
  }

  reloadPageWhenWaitTakeTest() {
    setTimeout(() => {
      window.location.href =  `${window.location.pathname}?apply=1`;
    }, 60000);
  }

  openApplyModal() {
    setTimeout(() => {
      const applyBtn = document.getElementById('applyBtn')
      applyBtn.click();
    }, 2000);
  }

  goBack() {
    if (this.user && this.user.acc_type == USER_TYPE.EMPLOYER) {
      this.router.navigate(['/employer-dashboard']);
    } else if (this.noHistoryStage) {
      this.router.navigate(['/job']);
    } else {
      this.location.back();
    }
    // const historyUrl = this.previousRouteService.getCurrentUrl();
    // setTimeout(() => {
    //   const current = this.previousRouteService.getCurrentUrl();
    //   if (current == historyUrl) {
    //     this.router.navigate(['/job']);
    //   }
    // }, 200);
  }


  bookMarkJob() {
    if (this.user) {
      const statusBookMark = this.isBookmarked ? false : true;
      const type = this.isBookmarked ? BOOKMARK_CONFIG.UN_BOOKMARK : BOOKMARK_CONFIG.BOOKMARK;
      this.jobService.makeBookMark(this.jobDetails.id, type).subscribe(res => {
        if (statusBookMark === false) {
          this.listBookmark = this.listBookmark.filter(item => {
            return item != Number(this.jobDetails.id)
          })
        } else {
          this.listBookmark.push(this.jobDetails.id);
        }
        this.subjectService.listBookmark.next(this.listBookmark);
        this.isBookmarked = statusBookMark;
      })

    } else {
      this.router.navigate(['/login']);
    }
  }

  getListJobsFromThisEmp(empID, currentJobId) {
    this.jobService.getListJobsFromThisEmployer({
      orderNo: JOB_ORDER.BEST_MATCH,
      searchType: "",
      userId: empID
    }).subscribe(res => {
      this.listJobsFormEmployer = res.listJob.filter(item => {
        return item.id != currentJobId;
      });
    }, err => {
      this.helperService.showToastSuccess(err);
    })
  }

  getCompanyDetails(url) {
    const id = this.helperService.getIdFromSlugUrl(url);
    if(!id) return;
    this.isCallingApi = true;
    this.jobService.getCompanySearchDetails(Number(id)).subscribe(data => {
      this.jobDetails = data;
      this.isCallingApi = false;
    }, err => {
      this.isCallingApi = false;
      this.helperService.showToastError(err);
    });
  }

  getJobDetail(url) {
    const id = this.helperService.getIdFromSlugUrl(url);
    this.isCallingApi = true;
    this.jobService.getjobDetails(Number(id)).subscribe(res => {
      this.jobDetails = res;
      this.isCallingApi = false;
      this.getListJobsFromThisEmp(this.jobDetails.employerId, id);
      this.subjectService.listBookmark.subscribe(listBookmark => {
        this.listBookmark = listBookmark;
        this.listBookmark.forEach(item => {
          if (Number(item) === Number(id)) {
            this.isBookmarked = true;
          } else {
            this.isBookmarked = false;
          }
        })

      })
      this.ceoService.changeMetaTag([{
        title: 'title',
        content: this.jobDetails.title
      }, {
        title: 'description',
        content: this.jobDetails.description
      }, {
        title: 'image',
        content: this.jobDetails.companyLogo
      }])
    }, errorRes => {
      this.helperService.showToastError(errorRes);
    })
  }

  getMyAssessment() {
    this.isLoadingMyAssessment = true;
    this.assessmentService.getMyAssessment().subscribe(res => {
      this.listMyAssessment = res;
      this.isLoadingMyAssessment = false;
    }, err => {
      this.isLoadingMyAssessment = false;
      this.helperService.showToastError(err);
    })
  }

  changeTabs(tabName) {
    if (tabName === 'job-info') {
      this.jobInfoTab = true;
      this.companyInfoTab = false;
    } else {
      this.jobInfoTab = false;
      this.companyInfoTab = true;
    }
  }

  showModalAlert(modalAlert) {
    this.modalAlertRef = this.modalService.open(modalAlert, {
      windowClass: 'modal-alert',
      size: 'md',
      backdrop: 'static',
      centered: true
    });
  }

  closeModal() {
    this.modalAlertRef.close();
    window.location.href =  `${window.location.pathname}?apply=1`;
  }
}
