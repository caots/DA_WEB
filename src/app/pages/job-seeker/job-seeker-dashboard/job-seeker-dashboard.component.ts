import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  PAGING,
  BOOKMARK_CONFIG,
  JOB_ORDER,
  EMPLOYMENT_TYPE,
  JOB_TRAVEL,
  WITHIN_MILES,
  JOB_PERCENT_TRAVEL_TYPE,
  EXPIRATION_DATE,
  DEFAULT_WITHIN,
  LIST_TAB,
  FOLLOW_TAB,
  CUSTOM_ASSESSMENT_ID,
  USER_TYPE,
  CEO_TAG_CONFIG
} from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { Job } from 'src/app/interfaces/job';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { Assesment } from 'src/app/interfaces/assesment';
import { JobService } from 'src/app/services/job.service';
import { AssessmentService } from 'src/app/services/assessment.service'

import { SearchJobJobSeeker } from 'src/app/interfaces/search';
import { PaginationConfig } from 'src/app/interfaces/paginattionConfig';
import { SubjectService } from 'src/app/services/subject.service';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';
import { PaymentService } from 'src/app/services/payment.service';
import { CardSettings } from 'src/app/interfaces/cardInfo';
import { JobCategory } from 'src/app/interfaces/jobCategory';
import { Company, companySearch } from 'src/app/interfaces/company';
import { JobLevel } from 'src/app/interfaces/jobLevel';
import { PreviousRouteService } from 'src/app/services/previous-route.service';
import { mergeMap } from 'rxjs/operators';
import { ModalConfirmVerificationEmailComponent } from 'src/app/components/modal-confirm-verification-email/modal-confirm-verification-email.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ms-job-seeker-dashboard',
  templateUrl: './job-seeker-dashboard.component.html',
  styleUrls: ['./job-seeker-dashboard.component.scss']
})

export class JobSeekerDashboardComponent implements OnInit {
  user: UserInfo;
  orderBy: number;
  listTab: any = LIST_TAB;
  jobBadgeNumber: object;
  listJob: Array<Job> = [];
  isSearching: boolean;
  isBookmarking: boolean;
  currentTab: string;
  messageNotFound: string;
  isLoadingListJob: boolean;
  isLoadingMyAssessment: boolean;
  listBookmark: number[] = [];
  isShowSearchAdvanced: boolean;
  querySearch: SearchJobJobSeeker;
  paginationConfig: PaginationConfig;
  listCategory: Array<JobCategory>;
  listCategoryRoot: Array<JobCategory>;
  listAssessments: Array<Assesment> = [];
  listAssessmentSelected: Array<Assesment> = [];
  listMyAssessment: Array<Assesment> = [];
  orderBestMatch: number = JOB_ORDER.BEST_MATCH;
  settingsCard: CardSettings;
  listCompany: companySearch[];
  listCity: string[];
  listLevel: JobLevel[];
  JOB_PERCENT_TRAVEL_TYPE = JOB_PERCENT_TRAVEL_TYPE;
  EMPLOYMENT_TYPE = EMPLOYMENT_TYPE;
  JOB_TRAVEL = JOB_TRAVEL;
  WITHIN_MILES = WITHIN_MILES;
  EXPIRATION_DATE = EXPIRATION_DATE;
  listFallUnder: Array<string> = [];
  condition: any;
  paramsSearchCompany: Object;
  totalEmplopyerFollowed: number;
  checkCallApiGetListJobFirstTime: boolean = false;
  isShowFollowEmployers: boolean = false;
  checkMappingCategoryAssessments: boolean = false;
  constructor(
    private router: Router,
    private jobService: JobService,
    private modalService: NgbModal,
    private paymentService: PaymentService,
    private userService: UserService,
    private assessmentService: AssessmentService,
    private activatedRoute: ActivatedRoute,
    private helperService: HelperService,
    private subjectService: SubjectService,
    private previousRouteService: PreviousRouteService,
  ) {
    this.currentTab = '';
    this.messageNotFound = MESSAGE.JOB_SEARCH_JOBSEEKER_NOT_FOUND;
    this.querySearch = new SearchJobJobSeeker();
  }

  ngOnInit(): void {
    this.paramsSearchCompany = { page: 0, pageSize: 100 };
    this.subjectService.listBookmark.subscribe(listBookmark => {
      if (!listBookmark) return;
      this.listBookmark = listBookmark;
    })
    this.subjectService.listIdEmployerFollows.subscribe(data => {
      if (!data) return;
      this.totalEmplopyerFollowed = data.length;
    })
    this.subjectService.listLevel.subscribe(listLevel => {
      if (!listLevel) return;
      this.listLevel = listLevel;
    })
  
    this.subjectService.user.subscribe(user => {
      if (!user) return;
      this.user = user;
      if (this.user.acc_type == USER_TYPE.JOB_SEEKER) this.getMyAssessment();
    })
      setTimeout(() => {
        if (this.user && this.user.acc_type == USER_TYPE.JOB_SEEKER) {
          this.getMyAssessment();
        }
      }, 200);

    this.paginationConfig = {
      currentPage: 0,
      totalRecord: 0,
      maxRecord: PAGING.MAX_ITEM
    }
    this.activatedRoute.queryParams.subscribe(params => {
      if (!params || !params.pageSize) {
        return;
      }
      let page = 1;
      if (params && params.page) {
        page = parseInt(params.page);
      }
      if (params && params.orderNo) {
        this.orderBy = params.orderNo;
      }
      if (params.q) {
        this.querySearch.name = params.q;
      }
      if (params.place) {
        this.querySearch.place = params.place;
      }
      if (params && params.searchType) {
        if (this.listTab.find(tab => params.searchType == tab.id)) {
          this.currentTab = params.searchType;
        } else {
          this.currentTab = '';
        }
      }
      if (Number.isInteger(page) && page >= 1) {
        this.paginationConfig.currentPage = page - 1;
      }
      Object.assign(this.querySearch, params);

    })
    if (this.currentTab != FOLLOW_TAB.id) this.getDataMaster(this.querySearch);
    this.jobBadgeNumber = {
      search: 0,
      bookmark: 0,
      applied: 0
    }
  }

  checkQueryParams(params) {
    if (params.salaryFrom) {
      this.querySearch.salaryFrom = Number.parseInt(params.salaryFrom);
      this.isShowSearchAdvanced = true;
    }
    if (params.salaryTo) {
      this.querySearch.salaryTo = Number.parseInt(params.salaryTo);
      this.isShowSearchAdvanced = true;
    }
    if (params.salaryType >= 0) {
      this.querySearch.salaryType = params.salaryType;
      this.isShowSearchAdvanced = true;
    }
    if (params.city) {
      this.querySearch.city = params.city;
      this.isShowSearchAdvanced = true;
    }
    if (params.state) {
      this.querySearch.state = params.state;
    }
    // new search
    if (params.employerId) {
      // setdata tmp
      const employerTmp = {
        companyID: params.employerId,
        companyName: ''
      };
      this.querySearch.employer = employerTmp;
      // setdata real
      const employer = this.listCompany && this.listCompany.find(ca => ca.companyID == params.employerId);
      if (employer) this.querySearch.employer.companyName = employer.companyName;
      this.isShowSearchAdvanced = true;
    }

    if (params.jobType) {
      this.querySearch.jobType = params.jobType;
      this.isShowSearchAdvanced = true;
    }
    // working place
    if (params.travel) {
      this.querySearch.travel = params.travel;
      this.isShowSearchAdvanced = true;
    }
    //Industry
    if (params.jobFallUnder) {
      this.querySearch.jobFallUnder = params.jobFallUnder.toString();
      this.isShowSearchAdvanced = true;
    }
    let condition = this.getSearchCondition();
    condition = {...condition, pageSize: 100};
    this.getListCompnaySearch(condition);
    this.getListJob();
  }

  getBadgeNumber() {
    this.jobService.getTotalJob().then(resTotal => {
      this.listTab.forEach(tab => {
        const found = resTotal.find(total => tab.id == total.id);
        tab['total'] = found ? found.total : 0;
      })
    })
  }

  convertSalaryValue(condition){
    const type = Number.parseInt(condition.salaryType);
    if (type >= 0) {
      if (condition.salaryFrom) {
        condition.salaryFrom = this.jobService.convertSalary(condition.salaryFrom, type);
      }
      if (condition.salaryTo) {
        condition.salaryTo = this.jobService.convertSalary(condition.salaryTo, type);
      }
    }
    return condition;
  }

  getListJob() {
    this.isLoadingListJob = true;
    this.condition = this.getSearchCondition();
    const conditionChangePage = Object.assign({}, this.condition, { page: 0, searchType: this.currentTab });
    const query = this.jobService._convertObjectToQuery(conditionChangePage);
    this.previousRouteService.replaceStage(`/job?${query}`);
    this.jobService.getListJobOfJobSeeker(this.condition).subscribe(res => {
      this.isSearching = false;
      this.isLoadingListJob = false;
      this.paginationConfig.totalRecord = res.total;
      this.listJob = res.listJob;
      const tabActive = LIST_TAB.find(t => t.id == this.condition.searchType);
      if (tabActive) {
        tabActive['total'] = res.total;
      }
      // this.checkCallApiGetListJobFirstTime = true;
    }, err => {
      this.isSearching = false;
      this.isLoadingListJob = false;
      this.helperService.showToastError(err);
    });
  }

  getMyAssessment() {
    if (!this.user) { return; }
    this.isLoadingMyAssessment = true;
    this.assessmentService.getMyAssessment().subscribe(res => {
      this.listMyAssessment = res;
      this.isLoadingMyAssessment = false;
    }, err => {
      this.isLoadingMyAssessment = false;
      this.helperService.showToastError(err);
    })
  }

  changeTab(tab) {
    if (this.currentTab == tab.id) { return; }
    const tabActive = this.listTab.find(t => t.id === this.currentTab);
    if (tabActive) {
      delete tabActive.total;
    }

    this.currentTab = tab.id;

    const queryParams = {
      searchType: tab.id
    }

    this.paginationConfig = {
      currentPage: 0,
      totalRecord: 0,
      maxRecord: PAGING.MAX_ITEM
    }
    if (this.currentTab == FOLLOW_TAB.id) {
      this.router.navigate([], {
        queryParams,
        queryParamsHandling: 'merge'
      })
    } else this.resetSearchJob();
    this.querySearch.searchType = tab.id;
    this.subjectService.tabListJobJobSeeker.next(tab.id);
  }

  paginationJob(page) {
    this.paginationConfig.currentPage = page;
    let condition = this.getSearchCondition();
    this.getListJob();
    condition = {...condition, pageSize: 100};
    this.getListCompnaySearch(condition);
  }

  searchJob() {
    this.paginationConfig.currentPage = 0;
    // this.router.navigate([], { queryParams: { searchType: this.currentTab } });
    let condition = this.getSearchCondition();
    condition = {...condition, pageSize: 100};
    this.getListJob();
    this.getListCompnaySearch(condition);
  }

  applyJob(job) {
    if (!this.user) {
      this.router.navigate(['/login']);
    }
  }

  addDrawJob() {
    this.getListJob();
  }

  bookmarkJob(job) {
    if (!this.user) {
      this.router.navigate(['/login']);
    } else {
      if (!this.isBookmarking) {
        this.isBookmarking = true;
        const type = job.status ? BOOKMARK_CONFIG.UN_BOOKMARK : BOOKMARK_CONFIG.BOOKMARK;
        this.jobService.makeBookMark(job.id, type).subscribe(res => {
          if (job.status) {
            this.listBookmark = this.listBookmark.filter(bookmark => bookmark != job.id);
          } else {
            this.listBookmark.push(job.id);
          }

          this.subjectService.listBookmark.next(this.listBookmark);
          this.isBookmarking = false;
          if (this.currentTab == 'bookmark') {
            this.getListJob();
          }
        })
      }
    }
  }

  resetSearchJob() {
    this.querySearch = new SearchJobJobSeeker();
    this.orderBy = undefined;
    this.paramsSearchCompany = { page: 0, pageSize: 100 };
    this.getListCompnaySearch(this.paramsSearchCompany);
    this.getListJob();
  }

  isBookmark(job) {
    return this.listBookmark.indexOf(job.id) > -1;
  }

  getSearchCondition(): Object {
    let condition: any = {
      searchType: this.currentTab,
      page: this.paginationConfig.currentPage,
      pageSize: this.paginationConfig.maxRecord,
    }
    if (this.querySearch.searchType != undefined) condition.searchType = this.querySearch.searchType;

    if (this.querySearch.name) {
      condition.q = this.querySearch.name;
    }

    if (this.orderBy !== undefined && this.orderBy != 1) {
      condition.orderNo = this.orderBy;
    }

    if (this.querySearch.place) {
      condition.place = this.querySearch.place;
    }
    if(this.querySearch.city) condition.city = this.querySearch.city;
    if(this.querySearch.state) condition.state = this.querySearch.state;

    if (this.isShowSearchAdvanced) {
      // Offered compensation 
      if (this.querySearch.salaryFrom) {
        condition.salaryFrom = this.querySearch.salaryFrom;
      }
      if (this.querySearch.salaryTo) {
        condition.salaryTo = this.querySearch.salaryTo;
      }
      if (this.querySearch.salaryType >= 0) {
        condition.salaryType = this.querySearch.salaryType;
      }
      // more search
      // company 
      if (this.querySearch.employer) {
        condition.employerId = this.querySearch.employer.companyID;
      }
      //employment type
      if (this.querySearch.jobType >= 0) {
        condition.jobType = this.querySearch.jobType;
      }
    
      // working place
      if (this.querySearch.travel >= 0) {
        condition.travel = this.querySearch.travel;
      }
      //Industry
      if (this.querySearch.jobFallUnder) {
        condition.jobFallUnder = this.querySearch.jobFallUnder;
      }
    }
    return condition;
  }

  getListCompnaySearch(params) {
    this.jobService.getListCompanyOfJobSeeker(params).subscribe(data => {
      this.listCompany = data;
      this.listCompany.sort(function (a, b) { return a.companyName.localeCompare(b.companyName) });
    });
  }

  getListIndustriesSearch() {
    this.jobService.getListIndustriesOfJobSeeker().subscribe(data => {
      this.listFallUnder = data;
      this.listFallUnder.sort(function (a, b) { return a.localeCompare(b) });
    });
  }

  async getDataMaster(params) {
    await Promise.all([ 
      this.getListCompnaySearch(this.paramsSearchCompany),
      this.getListIndustriesSearch(),
      this.checkQueryParams(params)
    ])
   
  }
}

