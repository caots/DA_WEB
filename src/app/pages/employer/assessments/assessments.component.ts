import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MESSAGE } from 'src/app/constants/message';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import {
  MODE,
  PAGING,
  PAYMENT_STATUS,
  PERMISSION_TYPE,
  TAB_ASSESSMENT_JOBSEEKER
} from 'src/app/constants/config';
import { Assesment } from 'src/app/interfaces/assesment';
import { JobLevel } from 'src/app/interfaces/jobLevel';
import { JobCategory } from 'src/app/interfaces/jobCategory';
import { HelperService } from 'src/app/services/helper.service';
import { AuthService } from 'src/app/services/auth.service';
import { PermissionService } from 'src/app/services/permission.service';
import { JobService } from 'src/app/services/job.service';
import { AssessmentService } from 'src/app/services/assessment.service';
import { PaginationConfig } from 'src/app/interfaces/paginattionConfig';
import { PaymentService } from 'src/app/services/payment.service';
import { SubjectService } from 'src/app/services/subject.service';
import { PreviousRouteService } from 'src/app/services/previous-route.service';
import { CardSettings } from 'src/app/interfaces/cardInfo';

@Component({
  selector: 'ms-assessments',
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.scss']
})
export class AssessmentsComponent implements OnInit {
  @ViewChild('modalAddJob', { static: false }) modalAddJob: ElementRef;
  @ViewChild('modalPrivateOrPublic', { static: false }) modalPrivateOrPublic: ElementRef;
  @ViewChild('modalEditJob', { static: false }) modalEditJob: ElementRef;
  isLoading: boolean;
  listLevel: Array<JobLevel> = [];
  filterCondition: FilterCondition;
  paramsService: Object = PARAMS;
  isAddingJob: boolean;
  isSaveDraft: boolean;
  userData: any;
  permission = PERMISSION_TYPE;
  listAssessment: Array<Assesment> = [];
  listAssessmentSuggest: Array<Assesment> = [];
  listCategory: Array<JobCategory> = [];
  listCheckedIds: Array<any> = [];
  paginationConfig: PaginationConfig;
  modalAddJobRef: NgbModalRef;
  modalEditJobRef: NgbModalRef;
  textConfirmNoSearchData: string = MESSAGE.NO_RESULT_SEARCH_JOB;
  tabCatalogue: boolean = true;
  tabCustomAssessments: boolean = false;
  isPriveJob: boolean;
  currentTag = TAB_ASSESSMENT_JOBSEEKER;
  settingsCards: CardSettings;

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    public permissionService: PermissionService,
    private jobService: JobService,
    private paymentService: PaymentService,
    private assessmentService: AssessmentService,
    private modalService: NgbModal,
    private subjectService: SubjectService,
    private helperService: HelperService,
    private previousRouteService: PreviousRouteService
  ) {
    this.filterCondition = {
      name: "",
      category: ""
    }
    this.paginationConfig = {
      currentPage: 0,
      totalRecord: 0,
      maxRecord: PAGING.MAX_ITEM
    }
  }

  ngOnInit(): void {
    this.subjectService.settingsCard.subscribe(data => {
      if(data){
        this.settingsCards = data;
      }
    })
    this.authService.getUserInfo().subscribe(user => {
      this.userData = user;
    })
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.custom == this.currentTag.custom) {
        this.tabCatalogue = false;
        this.tabCustomAssessments = true;
      } else {
        this.tabCatalogue = true;
        this.tabCustomAssessments = false;
      }
    })
    this.getListAssessments(this.paramsService);
    this.getDataMaster();
  }


  getListAssessments(params) {
    this.isLoading = true;
    params.q = encodeURIComponent(params.q);
    this.assessmentService.getListAssessmentEmployer(params).subscribe(data => {
      this.isLoading = false;
      this.listAssessment = data.listAssessment;
      this.paginationConfig.totalRecord = data.total;
    }, err => {
      this.isLoading = false;
      this.helperService.showToastError(err);
    })
  }

  paginationAssessment(page) {
    this.paginationConfig.currentPage = page;
    let params = Object.assign({}, this.paramsService,
      { page: page },
      { q: this.filterCondition.name },
      { categoryId: this.filterCondition.category })
    this.getListAssessments(params);
  }

  getDataMaster() {
    this.jobService.getListAssessMent().subscribe(listAssessment => {
      this.listAssessmentSuggest = listAssessment;
    }, err => {
      this.helperService.showToastError(err);
    })

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
  }

  searchAssessment() {
    let params = Object.assign({}, this.paramsService,
      { page: 0 },
      { q: this.filterCondition.name },
      { categoryId: this.filterCondition.category },
    );
    this.paginationConfig.currentPage = 0;
    this.getListAssessments(params);
  }

  searchEnterData(event) {
    event.preventDefault();
    let params = Object.assign({}, this.paramsService,
      { page: 0 },
      { q: this.filterCondition.name },
      { categoryId: this.filterCondition.category },
    );
    this.paginationConfig.currentPage = 0;
    this.getListAssessments(params);
  }

  async addToJobs() {
    if (this.listCheckedIds.length <= 0) {
      await this.helperService.showToastWarning(MESSAGE.WARNING_ADD_JOBS);
      return;
    }
    const isConfirm = await this.helperService.confirmPopup(MESSAGE.TITLE_CONFIRM_ADD_ASSESSMENT_JOB, 'Add to a New Job', 'Add to Existing Draft');
    if (isConfirm) {
      this.showModalAddNewJob(this.modalAddJob);
    } else {
      this.showModalEditJob(this.modalEditJob);
    }
  }

  showModalAddNewJob(modalAddJob) {
    this.modalAddJobRef = this.modalService.open(modalAddJob, {
      windowClass: 'modal-add-new-job',
      size: 'xl'
    })
  }


  showModalEditJob(modalEditJob) {
    this.modalEditJobRef = this.modalService.open(modalEditJob, {
      windowClass: 'modal-edit-job',
      size: 'xl'
    })
  }

  addToNewJob(job) {
    //console.log('abcdef');
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
      if (job.type == 'draft') {
        this.onBackDashboard();
        this.helperService.showToastSuccess(MESSAGE.ADD_JOB_DRAFT_SUCCESSFULY);
      } else {
        this.goToCarts();
      }
      this.modalAddJobRef.close();
    }, err => {
      if (job.type == 'draft') {
        this.isSaveDraft = false;
      } else {
        this.isAddingJob = false;
      }
      this.helperService.showToastError(err);
    })
  }

  onBackDashboard() {
    this.router.navigate(['/employer-dashboard'], { queryParams: { type: 'draft' } });
  }


  goToCarts() {
    this.paymentService.getAllJobInCard().subscribe((cards) => {
      this.subjectService.listCard.next(cards);
      this.router.navigate(['/shopping-card']);
    }, (error) => { });
  }

  checkAssessment(data) {
    if (data.status) {
      this.listCheckedIds.push(data.data);
    } else {
      let index = this.listCheckedIds.findIndex(x => x === data.data.id);
      this.listCheckedIds.splice(index, 1);
    }
  }

  changeTab(tabType) {
    if (tabType === this.currentTag.catalogue) {
      this.tabCatalogue = true;
      this.tabCustomAssessments = false;
    } else {
      this.tabCatalogue = false;
      this.tabCustomAssessments = true;
    }
    const custom = this.tabCatalogue ? this.currentTag.catalogue : this.currentTag.custom;
    this.previousRouteService.replaceStage(`/employer-assessments?custom=${custom}`);
  }
}

class FilterCondition {
  name: string;
  category: string;
}

const PARAMS = {
  q: '',
  categoryId: '',
  page: 0,
  pageSize: 10,
}

