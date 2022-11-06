import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import {
  MODE,
  PAGING,
  PAYMENT_STATUS,
  CREATE_JOB_TYPE,
  SEARCH_JOB_TYPE,
  CUSTOM_ASSESSMENT_ID,
  PAYMENT_DRAFT_PRIVATE_JOB,
  SALARY_TYPE
} from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { Job } from 'src/app/interfaces/job';
import { JobLevel } from 'src/app/interfaces/jobLevel';
import { JobCategory } from 'src/app/interfaces/jobCategory';
import { SearchJobEmployer } from 'src/app/interfaces/search';
import { Assesment } from 'src/app/interfaces/assesment';
import { JobService } from 'src/app/services/job.service';
import { TimeService } from 'src/app/services/time.service';
import { HelperService } from 'src/app/services/helper.service';
import { SubjectService } from 'src/app/services/subject.service';
import { PaginationConfig } from 'src/app/interfaces/paginattionConfig';
import { ItemJobCarts } from 'src/app/interfaces/itemJobCarts';
import { PaymentService } from 'src/app/services/payment.service';
import { CardSettings } from 'src/app/interfaces/cardInfo';
import { PreviousRouteService } from 'src/app/services/previous-route.service';
import { ModalConfirmVerificationEmailComponent } from 'src/app/components/modal-confirm-verification-email/modal-confirm-verification-email.component';

@Component({
  selector: 'ms-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  orderBy: number;
  tabType = TAB_TYPE;
  isTabActive: string;
  jobBadgeNumber: object;
  isSearching: boolean;
  isLoadingListJob: boolean;
  listJob: Array<Job> = [];
  editingJob: Job;
  upgradeJobData: Job;
  cardMode = MODE;
  isAddingJob: boolean;
  isSaveDraft: boolean;
  messageNotFound: string;
  querySearch: SearchJobEmployer;
  isGetJobFromSearch: boolean;
  isShowSearchAdvanced: boolean;
  paginationConfig: PaginationConfig;
  modalUpgradeJobRef: NgbModalRef;
  modalAddJobRef: NgbModalRef;
  modalAddNumberApplicantsRef: NgbModalRef;
  modalNewJobFromScratchOrTemplateRef: NgbModalRef;
  modalAddANewJobRef: NgbModalRef;
  modalAddJobFromTemplateRef: NgbModalRef;
  listLevel: Array<JobLevel> = [];
  listCategory: Array<JobCategory>;
  listAssessments: Array<Assesment>;
  typeMakeActive: boolean;
  lengthJob: number = 0;
  isPriveJob: boolean;
  isEdditJob: boolean;
  isTemplate: boolean = false;
  jobType: string[];
  settingsCard: CardSettings;
  jobPrivateApplicant: Job;
  isNotEditField: boolean = false;
  checkVerifiedEmailNUmber: number = 0;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private jobService: JobService,
    private timeService: TimeService,
    private helperService: HelperService,
    private subjectService: SubjectService,
    private paymentService: PaymentService,
    private previousRouteService: PreviousRouteService
  ) {
    this.paginationConfig = {
      currentPage: 0,
      totalRecord: 0,
      maxRecord: PAGING.MAX_ITEM
    }
    this.messageNotFound = MESSAGE.JOB_SEARCH_NOT_FOUND;
    this.querySearch = new SearchJobEmployer();
  }

  ngOnInit(): void {
    console.log('dashboard page');
    this.subjectService.checkPaymentUpgradeDone.subscribe((check) => {
      if (check) {
        this.closeModalUpgrade(true);
        this.subjectService.checkPaymentUpgradeDone.next(false);
      }
    })
    this.subjectService.checkPaymentAddApplicantsDone.subscribe((check) => {
      if (check) {
        this.closeModalAddPrivate(true);
        this.subjectService.checkPaymentAddApplicantsDone.next(false);
      }
    })
    this.subjectService.listAssessment.subscribe(data => {
      if (!data) return;
      this.listAssessments = data;
    });
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.type == TAB_TYPE.CLOSE) {
        this.isTabActive = TAB_TYPE.CLOSE;
      } else if (params && params.type == TAB_TYPE.DRAFT) {
        this.isTabActive = TAB_TYPE.DRAFT;
      } else {
        this.isTabActive = TAB_TYPE.ACTIVE;
      }
      if (params && params.searchType) this.isTabActive = params.searchType;
      if (params.q) this.querySearch.name = params.q;
      if (params.location) {
        this.querySearch.location = params.location;
        this.isShowSearchAdvanced = true;
      }
      if (params.category && params.category != 'undefined') {
        this.querySearch.category = params.category;
        this.isShowSearchAdvanced = true;
      }
    });
    this.getListJob();

    this.getDataMaster();
    this.getAllListPreviousJobTemplate({ searchType: SEARCH_JOB_TYPE.All });
    this.jobBadgeNumber = {
      active: 0,
      close: 0,
      draft: 0
    }
  }

  searchJob(queryParams) {
    this.querySearch = {...queryParams};
    this.isSearching = true;
    this.paginationConfig.currentPage = 0;
    setTimeout(() => {
      this.getListJob();
    }, 100)
  }

  resetSearchJob() {
    this.querySearch = new SearchJobEmployer();
    this.orderBy = undefined;
    this.getListJob();
  }

  changeTab(type: string) {
    if (type == TAB_TYPE.CLOSE) {
      this.isTabActive = TAB_TYPE.CLOSE;
    } else if (type == TAB_TYPE.DRAFT) {
      this.isTabActive = TAB_TYPE.DRAFT;
    } else {
      this.isTabActive = TAB_TYPE.ACTIVE;
    }
    this.querySearch = new SearchJobEmployer();
    this.orderBy = undefined;
    this.getListJob();
  }

  showModalAddNewJob(modalAddJob) {
    this.editingJob = null;
    this.typeMakeActive = false;
    this.modalAddJobRef = this.modalService.open(modalAddJob, {
      windowClass: 'modal-add-new-job',
      size: 'xl'
    })
  }

  showModalEditJob(job, modalAddNewJob) {
    if (this.isTabActive == this.tabType.DRAFT) {
      job.expiredAt = null;
      job.expiredDays = null;
      job.startHotJob = null;
      job.endHotJob = null;
      job.addUrgentHiringBadge = 0;
    }
    this.editingJob = job;
    this.isEdditJob = true;
    this.isTemplate = true;
    this.isNotEditField = true;
    this.isPriveJob = job.isPrivate == 1 ? true : false;
    this.typeMakeActive = true;
    this.modalAddANewJobRef = this.modalService.open(modalAddNewJob, {
      windowClass: 'modal-add-new-job',
      size: 'xl'
    })
  }

  async makeActiveDrafJob(job, modalAddJob) {
    job.expiredAt = null;
    job.expiredDays = null;
    job.startHotJob = null;
    job.endHotJob = null;
    job.addUrgentHiringBadge = 0;

    this.editingJob = job;
    this.isEdditJob = true;
    this.isNotEditField = false;
    this.isTemplate = true;
    this.typeMakeActive = true;

    this.isPriveJob = job.isPrivate == 1 ? true : false;

    if (this.isPriveJob && this.checkRequireFieldDraftPrivateJob(this.editingJob)) {
      const isConfirm = await this.helperService.confirmPopupDraftPriveJob();
      if (isConfirm && isConfirm == PAYMENT_DRAFT_PRIVATE_JOB) {
        this.createJobAndGoToShoppingCart(this.editingJob);
      } else if (isConfirm) {
        this.modalAddANewJobRef = this.modalService.open(modalAddJob, {
          windowClass: 'modal-add-new-job',
          size: 'xl'
        })
      }
      return;
    }

    const isConfirm = await this.helperService.confirmPopup(MESSAGE.TITLE_CONFIRM_MAKE_ACTIVE_JOB, MESSAGE.BTN_EDIT_TEXT, MESSAGE.BTN_CANCEL_TEXT);
    if (isConfirm) {
      this.modalAddANewJobRef = this.modalService.open(modalAddJob, {
        windowClass: 'modal-add-new-job',
        size: 'xl'
      })
    }
  }

  checkRequireFieldDraftPrivateJob(job: Job) {
    if (!job.title || job.title == '') return false;
    if (!job.description || job.description == '') return false;
    if (!job.listAssessment || job.listAssessment?.length == 0) return false;
    return true;
  }

  createJobAndGoToShoppingCart(job) {
    const data = this.convertJobFormData(job);
    const jobId = job.id;
    this.jobService.editJob(data, jobId).subscribe(res => {
      this.helperService.showToastSuccess(MESSAGE.ADD_JOB_SUCCESSFULY);
      this.goToCarts();
    }, err => {
      this.helperService.showToastError(err);
    })
  }

  convertJobFormData(data: Job) {
    let result = {
      title: data.title,
      employment_type: data.employmentType ? data.employmentType : 0,
      add_urgent_hiring_badge: data.addUrgentHiringBadge ? data.addUrgentHiringBadge : 0,
      salary: data.salary,
      desciption: data.description,
      benefits: data.benefits,
      jobs_level_id: data.levelId,
      jobs_category_ids: data.categoryId,
      nbr_open: data.nbrOpen,
      city_name: data.cityName || '',
      state_name: data.stateName || '',
      expired_days: data.expiredDays,
      salary_type: data.salaryType,
      bonus: data.bonus || '',
      job_fall_under: data.jobFallUnder,
      percent_travel: data.percentTravel,
      specific_percent_travel_type: data.specificPercentTravel,
      schedule_job: data.scheduleJob,
      proposed_conpensation: data.proposedConpensation,
      salary_min: data.salaryMin,
      salary_max: data.salaryMax,
      is_private: 1,
      featured_start_date: data.startHotJob ,
      featured_end_date: data.endHotJob,
      is_make_featured: data.is_make_featured,
      assessments: data?.listAssessment ? data.listAssessment.map(assessment => {
        return {
          assessment_id: assessment.assessmentId,
          point: assessment.point,
          assessment_type: assessment.type
        }
      }) : null
    }
    return result;
  }

  async makeActiveClosedJob(job, modalAddJob) {
    job.expiredAt = null;
    job.expiredDays = null;
    job.startHotJob = null;
    job.endHotJob = null;
    job.addUrgentHiringBadge = 0;

    this.editingJob = job;
    this.isEdditJob = true;
    this.isNotEditField = false;
    this.isTemplate = true;
    this.typeMakeActive = true;
    this.isPriveJob = job.isPrivate == 1 ? true : false;
    const isConfirm = await this.helperService.confirmPopup(MESSAGE.TITLE_CONFIRM_MAKE_ACTIVE_JOB_CLOSED, MESSAGE.BTN_EDIT_TEXT, MESSAGE.BTN_CANCEL_TEXT);
    if (isConfirm) {
      this.modalAddANewJobRef = this.modalService.open(modalAddJob, {
        windowClass: 'modal-add-new-job',
        size: 'xl'
      })
    }
  }

  async deleteJob(job) {
    const isConfirm = await this.helperService.confirmPopup(MESSAGE.TITLE_CONFIRM_DELETE_JOB, MESSAGE.BTN_YES_TEXT);
    if (isConfirm) {
      this.jobService.deleteJob(job.id).subscribe(res => {
        this.helperService.showToastSuccess(MESSAGE.DELETE_JOB_SUCCESSFULLY);
        this.getListJob();
      }, err => {
        this.helperService.showToastError(err);
      })
    }
  }

  async copyJob(job) {
    const isConfirm = await this.helperService.confirmPopup(MESSAGE.CONFIRM_DUPPLICATE_JOB, MESSAGE.BTN_YES_TEXT);
    if (isConfirm) {
      this.jobService.duplicateJob(job.id).subscribe(res => {
        this.helperService.showToastSuccess(MESSAGE.DUPLICATE_JOB_SUCCESSFULLY);
        this.changeTab(this.tabType.DRAFT)
        this.getListJob();
      }, err => {
        this.helperService.showToastError(err);
      })
    }
  }

  addJob(job) {
    if (job.type == 'draft') {
      this.isSaveDraft = true;
    } else {
      this.isAddingJob = true;
    }
    this.jobService.createJob(job).subscribe(res => {
      if (job.type == 'draft') {
        this.isSaveDraft = false;
      } else {
        this.isAddingJob = false;
      }
      this.modalAddANewJobRef.close();
      if (job.type == 'draft') {
        this.helperService.showToastSuccess(MESSAGE.ADD_JOB_DRAFT_SUCCESSFULY);
        this.changeTab(this.tabType.DRAFT);
        this.getListJob();
      } else {
        this.helperService.showToastSuccess(MESSAGE.ADD_JOB_SUCCESSFULY);
        this.goToCarts();
      }
    }, err => {
      if (job.type == 'draft') {
        this.isSaveDraft = false;
      } else {
        this.isAddingJob = false;
      }
      this.helperService.showToastError(err);
    })
  }

  goToCarts() {
    this.paymentService.getAllJobInCard().subscribe((cards) => {
      this.subjectService.listCard.next(cards);
      this.router.navigate(['/shopping-card']);
    }, (error) => { });
  }

  editJob(data) {
    data.job.type == 'draft' ? this.isSaveDraft = true : this.isAddingJob = true;
    this.jobService.editJob(data.job, data.id).subscribe(res => {
      data.job.type == 'draft' ? this.isSaveDraft = false : this.isAddingJob = false;

      this.modalAddANewJobRef.close();
      if (this.typeMakeActive === true && this.isTabActive !== this.tabType.ACTIVE) {
        if (data.job.type == 'draft') {
          this.changeTab(this.tabType.DRAFT);
          this.helperService.showToastSuccess(MESSAGE.ADD_JOB_DRAFT_SUCCESSFULY);
          this.getListJob();
        } else {
          this.goToCarts();
        }
      } else {
        this.helperService.showToastSuccess(MESSAGE.UPDATE_JOB_SUCCESSFULY);
        this.getListJob();
      }
    }, err => {
      data.job.type == 'draft' ? this.isSaveDraft = false : this.isAddingJob = false;
      this.helperService.showToastError(err);
    })
  }

  paginationJob(page) {
    this.paginationConfig.currentPage = page;
    this.getListJob();
  }

  upgradteJob(job: Job, modalUpgradeJob) {
    this.upgradeJobData = job;
    this.modalUpgradeJobRef = this.modalService.open(modalUpgradeJob, {
      windowClass: 'modal-add-new-job-from-scratch',
      size: 'xl'
    });

  }

  getListJob() {
    this.isLoadingListJob = true;
    const condition = this.getSearchCondition();
    const query = this.jobService._convertObjectToQuery(condition);
    this.previousRouteService.replaceStage(`/employer-dashboard?${query}`);
    this.jobService.getListJob(condition).subscribe(data => {
      this.isSearching = false;
      this.isLoadingListJob = false;
      this.listJob = data.listJob;
      this.paginationConfig.totalRecord = data.total;
      if (condition.searchType == TAB_TYPE.ACTIVE) {
        this.jobBadgeNumber['active'] = data.total;
      } if (condition.searchType == TAB_TYPE.DRAFT) {
        this.jobBadgeNumber['draft'] = data.total;
      } if (condition.searchType == TAB_TYPE.CLOSE) {
        this.jobBadgeNumber['close'] = data.total;
      }
    }, err => {
      this.isSearching = false;
      this.isLoadingListJob = false;
      this.helperService.showToastError(err);
    })
  }

  getSearchCondition() {
    this.isGetJobFromSearch = false;
    let condition: any = {
      searchType: this.isTabActive,
      page: this.paginationConfig.currentPage,
      pageSize: this.paginationConfig.maxRecord
    }

    if (this.querySearch.jobType) {
      condition.jobType = this.querySearch.jobType;
      this.isGetJobFromSearch = true;
    }

    if (this.querySearch.name) {
      condition.q = this.querySearch.name;
      this.isGetJobFromSearch = true;
    }

    if (this.orderBy !== undefined) {
      condition.orderNo = this.orderBy;
    }

    if (this.isShowSearchAdvanced) {
      if (this.querySearch.category){
        this.isGetJobFromSearch = true;
        condition.category = this.querySearch.category;
      }else condition.category = '';

      if (this.querySearch.createdAtFrom) {
        this.isGetJobFromSearch = true;
        condition.createDateFrom = this.timeService.getStartTimeOfDate(this.querySearch.createdAtFrom).toISOString();
      }

      if (this.querySearch.createdAtTo) {
        this.isGetJobFromSearch = true;
        condition.createDateTo = this.timeService.getEndTimeOfDate(this.querySearch.createdAtTo).toISOString();
      }

      if (this.querySearch.location) {
        this.isGetJobFromSearch = true;
        condition.location = this.querySearch.location;
      }
    }

    return condition;
  }

  getDataMaster() {
    this.jobService.getListCategory().subscribe((listCategory: JobCategory[]) => {
      this.listCategory = listCategory;
    }, err => {
      this.helperService.showToastError(err);
    })

    this.jobService.getListJobLevel().subscribe((listLevel: JobLevel[]) => {
      this.listLevel = listLevel;
    }, err => {
      this.helperService.showToastError(err);
    })

    this.paymentService.getSettingsPayment().subscribe(res => {
      this.settingsCard = res;
    }, err => {
      this.helperService.showToastError(err);
    })

  }

  showListApplicants(jobId) {
    this.router.navigate(['/applicants'], { queryParams: { jobId: jobId } });
  }

  showModaAddApplicantsIntoPrivateJob(job, modalAddNumberApplicants) {
    this.jobPrivateApplicant = job;
    this.modalAddNumberApplicantsRef = this.modalService.open(modalAddNumberApplicants, {
      windowClass: 'modal-add-number-applicants',
      size: 'lg'
    })
  }

  showModalAddNewJobFromScratchOrTemplate(modalNewJobFromScratchOrTemplate, modalAddNewJob) {
    this.isEdditJob = false;
    this.isNotEditField = false;
    if (this.lengthJob <= 0) {
      this.isTemplate = false;
      this.modalAddANewJobRef = this.modalService.open(modalAddNewJob, {
        windowClass: 'modal-add-a-new-job',
        size: 'xl'
      });
    } else {
      this.modalNewJobFromScratchOrTemplateRef = this.modalService.open(modalNewJobFromScratchOrTemplate, {
        windowClass: 'modal-add-new-job-from-scratch',
        size: 'lg'
      });
    }
  }

  async closeModalNewJob(isNext = false) {
    if (isNext) {
      this.modalNewJobFromScratchOrTemplateRef.close();
      return;
    }
    // const isConfirm = await this.helperService.confirmPopup(MESSAGE.CONFIRM_CLOSE, MESSAGE.BTN_CLOSE_TEXT, MESSAGE.BTN_CANCEL_TEXT);
    // if (isConfirm) {
    this.modalNewJobFromScratchOrTemplateRef.close();
    // }
  }

  showModalPrivateOrPublic(type, modalAddNewJob, modalAddJobFromtemplate) {
    this.closeModalNewJob(true);
    if (type == CREATE_JOB_TYPE.SCRATCH) {
      this.isTemplate = false;
      this.modalAddANewJobRef = this.modalService.open(modalAddNewJob, {
        windowClass: 'modal-add-a-new-job',
        size: 'xl'
      });
    } else {
      this.isTemplate = true;
      this.showModalAddJobFromTemplate(modalAddJobFromtemplate);
    }

  }

  showModalAddJobFromTemplate(modalAddJobFromtemplate) {
    this.modalAddJobFromTemplateRef = this.modalService.open(modalAddJobFromtemplate, {
      windowClass: 'modal-add-job-from-template',
      size: 'md'
    });
  }

  addJobFromTemplate(job: Job, modalAddNewJob) {
    job.expiredAt = null;
    job.expiredDays = null;
    job.startHotJob = null;
    job.endHotJob = null;
    job.addUrgentHiringBadge = 0;

    this.editingJob = job;
    this.isEdditJob = false;
    this.isNotEditField = false;
    this.isTemplate = true;
    this.modalAddANewJobRef = this.modalService.open(modalAddNewJob, {
      windowClass: 'modal-add-a-new-job',
      size: 'xl'
    });
    this.modalAddJobFromTemplateRef.close();
  }

  getAllListPreviousJobTemplate(condition) {
    this.jobService.getListJob(condition).subscribe(data => {
      this.lengthJob = data.total;
    }, err => {
      this.helperService.showToastError(err);
    })
  }

  paymentPrivateJob() {
    this.modalAddNumberApplicantsRef.close();
    this.getListJob();
  }

  closeModalUpgrade(event) {
    if (event) this.getListJob();
    this.modalUpgradeJobRef.close();
  }

  closeModalAddPrivate(event) {
    if (event) this.getListJob();
    this.modalAddNumberApplicantsRef.close();
  }

}

const TAB_TYPE = {
  ACTIVE: '',
  CLOSE: 'expired',
  DRAFT: 'draft'
}
