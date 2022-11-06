import { PreviousRouteService } from 'src/app/services/previous-route.service';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { JobService } from 'src/app/services/job.service';
import { HelperService } from 'src/app/services/helper.service';
import { ApplicantsService } from 'src/app/services/applicants.service';
import { AuthService } from 'src/app/services/auth.service';

import { Item } from 'src/app/interfaces/item';
import { PAGING, JOB_APPLICANT_TYPE } from 'src/app/constants/config';
import { Applicants } from 'src/app/interfaces/applicants';
import { PaginationConfig } from 'src/app/interfaces/paginattionConfig';
import { Job } from 'src/app/interfaces/job';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Assesment } from 'src/app/interfaces/assesment';

@Component({
  selector: 'ms-applicants',
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.scss']
})
export class ApplicantsComponent implements OnInit {
  listApplicants: Array<Applicants> = [];
  paginationConfig: PaginationConfig;
  isLoadingListApplicants: boolean;
  listSort: Array<Item> = [];
  orderNo: number;
  tabActive: string;
  query: string;
  userData: any;
  listJob: Array<Job> = [];
  formSearchApplicants: FormGroup;
  isSearching: boolean;
  dropdownSettings: IDropdownSettings = {};
  jobId: any;
  jobseekerId: any;
  modalchangeWeightAssessmentRef: NgbModalRef;
  listAssessmentChangeWeight: Assesment[];
  listChangeWeightingAssessmentParams: any[];
  isGetJoseekerId: boolean;

  constructor(
    private modalService: NgbModal,
    private applicantsService: ApplicantsService,
    private helperService: HelperService,
    private router: Router,
    private jobService: JobService,
    private authService: AuthService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private previousRouteService: PreviousRouteService,
  ) {
    this.paginationConfig = {
      currentPage: 0,
      totalRecord: 0,
      maxRecord: PAGING.MAX_ITEM
    }

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.getDataMaster();
    this.authService.getUserInfo().subscribe(user => {
      this.userData = user;
    })
    this.listSort = this.applicantsService.getListSortApplicants();
    this.orderNo = 1;
    this.tabActive = '';
    this.query = '';
    this.isSearching = false;
    this.activatedRoute.queryParams.subscribe(params => {
      if (params) {
        this.isGetJoseekerId = false;
        if (params.jobId) {
          this.jobId = parseInt(params.jobId);
        }
        if (params.q) {
          this.query = params.q
        }
        if (params.jobseekerId) {
          this.jobseekerId = params.jobseekerId;
          //console.log('jobseekerId: ', this.jobseekerId)
          // Remove query params
          const condition = this.getConditionSearch(false);
          const query = this.jobService._convertObjectToQuery(condition);
          this.previousRouteService.replaceStage(`/applicants?${query}`);
        }
        this.isGetJoseekerId = true;
      };
      // this.getListApplicants(isGetJoseekerId);
    })
  }

  initForm() {
    this.formSearchApplicants = this.fb.group({
      name: "",
      jobId: '',
    })
  }

  getConditionSearch(isGetJoseekerId = false) {

    let condition: any = {
      q: this.query,
      orderNo: this.orderNo,
      page: this.paginationConfig.currentPage,
      pageSize: this.paginationConfig.maxRecord,
      searchType: this.tabActive
    }

    if (this.jobId) {
      condition.jobId = this.jobId;
    }
    if (this.jobseekerId && this.isGetJoseekerId) {
      condition.jobseekerId = this.jobseekerId;
      this.isGetJoseekerId = false;
    }
    if (this.listChangeWeightingAssessmentParams) condition.assessments = JSON.stringify(this.listChangeWeightingAssessmentParams);
    return condition;
  }

  selectJobId() {
    this.listChangeWeightingAssessmentParams = undefined;
    this.isSearching = true;
    this.paginationConfig.currentPage = 0;
    this.getListApplicants();
  }

  getListApplicants(isGetJoseekerId = false) {
    if (!this.jobId) { 
      this.isSearching = false;
      return; 
    }
    this.isLoadingListApplicants = true;
    let condition = this.getConditionSearch(isGetJoseekerId);
    const conditionQuery = this.getConditionSearch();
    const query = this.jobService._convertObjectToQuery(conditionQuery);
    this.previousRouteService.replaceStage(`/applicants?${query}`);
    this.applicantsService.getListApplicants(condition).subscribe(data => {
      this.isSearching = false;
      this.listApplicants = data.listApplicants;
      this.isLoadingListApplicants = false;
      this.paginationConfig.totalRecord = data.total;

    }, errorRes => {
      this.isSearching = false;
      this.isLoadingListApplicants = false;
      this.helperService.showToastError(errorRes);
    });
  }

  searchApplicants(data) {
    this.isSearching = true;
    this.query = data.name;
    this.paginationConfig.currentPage = 0;
    this.getListApplicants();
  }

  paginationApplicants(page) {
    this.paginationConfig.currentPage = page;
    this.getListApplicants();
  }

  changeSort(sort) {
    this.orderNo = sort.id;
    this.getListApplicants();
    return false;
  }

  changeTab(data) {
    this.isSearching = false;
    this.tabActive = data;
    this.paginationConfig.currentPage = 0;
    // this.router.navigate(['/applicants']);
    this.getListApplicants();
  }

  bookMark(data) {
    data.bookmarked = data.bookmarked === 0 ? 1 : 0;
    let bookMark = {
      "bookmark": data.bookmarked
    }
    this.applicantsService.bookMark(data.userId, bookMark).subscribe(res => {
      if (this.tabActive === 'bookmark') {
        this.listApplicants = this.listApplicants.filter(item => {
          return item.userId != data.userId;
        });
      }
    }, errorRes => {
      this.helperService.showToastError(errorRes);
    });
  }

  getDataMaster() {
    this.jobService.getListJobsCompactForEmployer({ pageSize: 1000 }).subscribe(data => {
      this.listJob = data.listJob;
      if (!this.jobId && this.listJob.length) { 
        this.jobId = this.listJob[0].id;
      }
      this.getListApplicants();
    }, err => {
      this.helperService.showToastError(err);
    })
  }

  reloadNote(status) {
    if (status) {
      this.getListApplicants();
    }
  }
  goBack() {
    this.location.back();
  }

  changeWeightSearch(listAssessment) {
    this.modalchangeWeightAssessmentRef.close();
    this.listChangeWeightingAssessmentParams = listAssessment;
    this.getListApplicants();
  }

  revertAssessmentSearch() {
    this.modalchangeWeightAssessmentRef.close();
    const index = this.listJob.findIndex(job => job.id == this.jobId);
    if (index >= 0) {
      const job = Object.assign({}, this.listJob[index]);
      this.listAssessmentChangeWeight = job.listAssessment;
    }
    this.listChangeWeightingAssessmentParams = undefined;
    this.getListApplicants();
  }

  openModalChangeWeightAssessment(changeWeightAssessment) {
    const index = this.listJob.findIndex(job => job.id == this.jobId);
    if (index >= 0) {
      const job = Object.assign({}, this.listJob[index]);
      this.listAssessmentChangeWeight = job.listAssessment;
    }
    this.modalchangeWeightAssessmentRef = this.modalService.open(changeWeightAssessment, {
      windowClass: 'modal-interview-schedule',
      size: 'md'
    })
  }
  showAllApplicant() {
    this.isSearching = true;
    this.query = '';
    this.formSearchApplicants.controls.name.setValue('');
    this.paginationConfig.currentPage = 0;
    this.getListApplicants();
  }
}
