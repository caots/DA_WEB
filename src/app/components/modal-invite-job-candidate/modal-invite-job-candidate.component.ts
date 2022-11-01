import { fromEvent, Subscription } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, map, distinctUntilChanged, filter } from "rxjs/operators";
import { Component, OnInit, Output, Input, EventEmitter, ViewChild, ElementRef, OnDestroy } from '@angular/core';

import { HelperService } from 'src/app/services/helper.service';
import { MESSAGE } from 'src/app/constants/message';
import { Job } from 'src/app/interfaces/job';
import { SubjectService } from 'src/app/services/subject.service';
import { Router } from '@angular/router';
import { CandidateService } from 'src/app/services/candidate.service';
import { Candidate } from 'src/app/interfaces/candidate';
import { PaginationConfig } from 'src/app/interfaces/paginattionConfig';
import { PAGING, TRACKING_RECRUITMENT_TYPE } from 'src/app/constants/config';
import { UserInfo } from 'src/app/interfaces/userInfo';

@Component({
  selector: 'ms-modal-invite-job-candidate',
  templateUrl: './modal-invite-job-candidate.component.html',
  styleUrls: ['./modal-invite-job-candidate.component.scss']
})
export class ModalInviteJobCandidateComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  @ViewChild('nameJobInput', { static: true }) nameJobInput: ElementRef;
  @Input() candidate: Candidate;
  @Output() close = new EventEmitter();
  listJobInvite: Job[] = [];
  nameJob: string;
  isLoading: boolean = false;
  isLoadingSubmitInvite: boolean = false;
  listJobInviteIds: number[] = [];
  paginationConfig: PaginationConfig;
  userData: UserInfo;
  constructor(
    private candidateService: CandidateService,
    private helperService: HelperService,
    private subjectService: SubjectService,
  ) { }

  ngOnInit(): void {
    const handlesubjectService = this.subjectService.user.subscribe(user => {
      if (!user) { return }
      this.userData = user;
    })
    this.subscription.add(handlesubjectService);
    this.paginationConfig = {
      currentPage: 0,
      totalRecord: 0,
      maxRecord: PAGING.MAX_ITEM
    }
    this.getAllJobInvite();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  onInviteJob() {
    if(this.listJobInviteIds.length <= 0) return;
    this.isLoadingSubmitInvite = true;
    const data = {
      jobseekerId: this.candidate.id,
      jobIds: this.listJobInviteIds
    }
    this.candidateService.inviteJob(data).subscribe(data => {
      this.isLoadingSubmitInvite = false;
      this.helperService.showToastSuccess(MESSAGE.INVITE_LIST_JOB_SUCCESS);
      this.close.emit();
    }, err => {
      this.isLoadingSubmitInvite = false;
      this.helperService.showToastError(err);
    })
  }

  onSelectedInviteJob(job) {
    const index = this.listJobInvite.findIndex(jobInvite => jobInvite.id == job.id);
    if (index >= 0) this.listJobInvite[index].selectedInviteJob = !this.listJobInvite[index].selectedInviteJob;
    if (this.listJobInvite[index].selectedInviteJob) this.listJobInviteIds.push(this.listJobInvite[index].id);
    else {
      const indexListSelected = this.listJobInviteIds.findIndex(id => id == job.id);
      if (index >= 0) this.listJobInviteIds.splice(indexListSelected, 1);
    }
  }

  getAllJobInvite() {
    const data = {
      page: this.paginationConfig.currentPage,
      pageSize: this.paginationConfig.maxRecord,
      jobseekerId: this.candidate.id,
      q: this.nameJob
    }
    this.isLoading = true;
    this.candidateService.getListJobToInvite(data).subscribe(data => {
      this.isLoading = false;
      this.listJobInvite = data.listJobInvite;
      this.paginationConfig.totalRecord = data.total;
      this.listJobInviteIds.map(id => {
        const index = this.listJobInvite.findIndex(job => id == job.id);
        if (index >= 0) this.listJobInvite[index].selectedInviteJob = true;
      })

    }, err => {
      this.isLoading = false;
      this.helperService.showToastError(err);
    })
  }

  paginationCandidate(page) {
    this.paginationConfig.currentPage = page;
    this.getAllJobInvite();
  }

  searchJob() {
    this.getAllJobInvite();
  }

  async closeModal() {
    const isConfirmed = await this.helperService.confirmPopup(MESSAGE.CONFIRM_CLOSE, MESSAGE.BTN_CLOSE_TEXT);
    if (!isConfirmed) {
      return;
    } else {
      this.close.emit();
    }
  }

}
