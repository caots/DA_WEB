import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { SALARY_TYPE, PERMISSION_TYPE, SEARCH_GROUP_TYPE, STATUS_APPLICANTS, PAGING, SALARY_PER_YEAR } from 'src/app/constants/config';
import { ASSESSMENT_WEIGHT } from 'src/app/constants/config';
import { HelperService } from 'src/app/services/helper.service';
import { ApplicantsService } from 'src/app/services/applicants.service';
import { PermissionService } from 'src/app/services/permission.service';
import { MessageService } from 'src/app/services/message.service';
import { Applicants } from 'src/app/interfaces/applicants';
import { Candidate } from 'src/app/interfaces/candidate';
import { CandidateService } from 'src/app/services/candidate.service';
import { Assesment } from 'src/app/interfaces/assesment';
import { AssessmentService } from 'src/app/services/assessment.service';
import { PaginationConfig } from 'src/app/interfaces/paginattionConfig';


@Component({
  selector: 'ms-candidate-item',
  templateUrl: './ms-candidate-item.component.html',
  styleUrls: ['./ms-candidate-item.component.scss']
})
export class MsCandidateItemComponent implements OnInit {

  @Input() candidate: Candidate;
  @Input() userData: any;
  @Input() listAssessmentSelected: Assesment[];
  @Output() bookApplicant = new EventEmitter();
  @Output() reloadNote = new EventEmitter();
  @Output() inviteJob = new EventEmitter();
  @Output() sendMessageCandidadate = new EventEmitter();
  modalNoteApplicantRef: NgbModalRef;
  paginationConfig: PaginationConfig;
  assessmentWeight: any = ASSESSMENT_WEIGHT;
  numberStar: Array<number> = Array.from(Array(5).keys());
  rateStar: number;
  stageName: string;
  permission = PERMISSION_TYPE;
  statusApplicant = STATUS_APPLICANTS;
  SALARY_PER_YEAR = SALARY_PER_YEAR;
  listAssessmentCandidate: any[];
  listSuggestAssessmentCandidate: any[];
  listAssessmentSelectedId: number[] = [];
  countAssessmentSelected: number = 0;
  viewMoreAssessment: boolean = false;
  isLoadingAssessmentHistory: boolean;
  MAX_ITEM_CANDIDATE_HISTORY = PAGING.MAX_ITEM_CANDIDATE_HISTORY

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private helperService: HelperService,
    private candaidateService: CandidateService,
    public permissionService: PermissionService,
    private messageService: MessageService,
    public asssessmentService: AssessmentService,
  ) { }

  ngOnInit(): void {
    // this.router.routeReuseStrategy.shouldReuseRoute = function () {
    //   return false;
    // };
    this.paginationConfig = {
      currentPage: 0,
      totalRecord: 0,
      maxRecord: PAGING.MAX_ITEM_CANDIDATE_HISTORY
    }
    this.listAssessmentSelected.map(ass => {
      this.listAssessmentSelectedId.push(ass.assessmentId);
      if (this.candidate[`weight_${ass.assessmentId}`] != null) this.countAssessmentSelected++;
    })
    // job_seeker_assessments_weight: 0
    // name: "Microsoft SQL Coding"
    //this.rateStar = this.applicant.jobSeekerRate ? this.applicant.jobSeekerRate.toFixed(0) : -1;
  }

  getWeightAssessmentCandidate(id) {
    return this.candidate[`weight_${id}`]
  }

  bookMark() {
    const bookmarded = !this.candidate.bookmarked || this.candidate.bookmarked == 0 ? 1 : 0;
    this.candidate = Object.assign({}, this.candidate, { bookmarked: bookmarded });
    this.bookApplicant.emit(this.candidate);
  }

  getJobseekerPoint(job_seeker_point: number, job_assessments_point: number) {
    return ((job_seeker_point / job_assessments_point) * 100).toFixed(0);
  }

  rateStarNumber(number) {
    this.rateStar = number;
    //this.updateRateStarApplicant(number);
  }

  findSalaryType(type) {
    const index = SALARY_TYPE.findIndex(t => t.id == type);
    if (index >= 0) return SALARY_TYPE[index].title;
  }

  onInviteJob(candidate) {
    this.inviteJob.emit(candidate)
  }

  getHistoryAssessmentCandidate() {
    this.isLoadingAssessmentHistory = true;
    const condition = {
      page: this.paginationConfig.currentPage,
      pageSize: this.paginationConfig.maxRecord,
      jobseekerId: this.candidate.id,
      notInAssessmentIds: this.listAssessmentSelectedId.toString()
    }
    this.candaidateService.getHistoryAssessmentCandidate(condition).subscribe(data => {
      this.viewMoreAssessment = true;
      this.isLoadingAssessmentHistory = false;
      this.listAssessmentCandidate = data.listCandidateHistory;
      this.paginationConfig.totalRecord = data.total;
    }, errorRes => {
      this.isLoadingAssessmentHistory = false;
      this.helperService.showToastError(errorRes);
    });
  }

  paginationCandidate(page) {
    this.paginationConfig.currentPage = page;
    this.getHistoryAssessmentCandidate();
  }

  viewMoreAssessmentHistory() {
    if (this.viewMoreAssessment) {
      this.viewMoreAssessment = false;
      return;
    }
    if (this.listAssessmentCandidate){
      this.viewMoreAssessment = true;
      return;
    }
    this.getHistoryAssessmentCandidate();
  }

  // updateRateStarApplicant(rate) {
  //   let data = {
  //     rate: rate,
  //     jobId: this.applicant.jobId
  //   }
  //   this.applicantsService.updateRating(this.applicant.jobseekerId, data).subscribe(res => {
  //   }, errorRes => {
  //     this.helperService.showToastError(errorRes);
  //   });
  // }

  redirectToMessageCenter(candidate: Candidate) {
    if (candidate.chat_group_id != null) {
      this.messageService.redirectToDSCandidateCenter(candidate);
    } else {
      this.sendMessageCandidadate.emit(candidate);
    }
  }
}