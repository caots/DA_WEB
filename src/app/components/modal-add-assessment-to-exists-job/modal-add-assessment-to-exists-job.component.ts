import { fromEvent } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, map, distinctUntilChanged, filter } from "rxjs/operators";
import { Component, OnInit, Output, Input, EventEmitter, ViewChild, ElementRef } from '@angular/core';

import { HelperService } from 'src/app/services/helper.service';
import { JobService } from 'src/app/services/job.service';
import { MESSAGE } from 'src/app/constants/message';
import { Assesment } from 'src/app/interfaces/assesment';
import { Job } from 'src/app/interfaces/job';
import { JobLevel } from 'src/app/interfaces/jobLevel';
import { JobCategory } from 'src/app/interfaces/jobCategory';
import { PaymentService } from 'src/app/services/payment.service';
import { SubjectService } from 'src/app/services/subject.service';
import { Router } from '@angular/router';
import { SCRATCH_JOB_TYPE } from 'src/app/constants/config';
import { CardSettings } from 'src/app/interfaces/cardInfo';

@Component({
  selector: 'ms-modal-add-assessment-to-exists-job',
  templateUrl: './modal-add-assessment-to-exists-job.component.html',
  styleUrls: ['./modal-add-assessment-to-exists-job.component.scss']
})
export class ModalAddAssessmentToExistsJobComponent implements OnInit {
  @ViewChild('modalEditJob', { static: false }) modalEditJob: ElementRef;
  @ViewChild('nameJobInput', { static: true }) nameJobInput: ElementRef;
  @Output() close = new EventEmitter();
  @Input() listSelectedAssessment: Array<Assesment> = [];
  @Input() isAddingJob: boolean;
  @Input() isSaveDraft: boolean;
  @Input() listLevel: Array<JobLevel> = [];
  @Input() listCategory: Array<JobCategory> = [];
  @Input() listAssessment: Array<Assesment> = [];

  isLoading: boolean;
  nameJob: string;
  listJobDrafts: Array<Job> = [];
  currentJobSelect: Job;
  listJobDraftSuggest: Array<Job> = [];
  modalEditJobRef: NgbModalRef;
  isPriveJob: boolean;
  settingsCards: CardSettings;
  constructor(
    private router: Router,
    private jobService: JobService,
    private modalService: NgbModal,
    private helperService: HelperService,
    private paymentService: PaymentService,
    private subjectService: SubjectService
  ) { }

  ngOnInit(): void {
    this.subjectService.settingsCard.subscribe(data => {
      if(data){
        this.settingsCards = data;
      }
    })
    this.getAllJobDraft();
    fromEvent(this.nameJobInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , filter(res => res.length >= 0)
      , debounceTime(300)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      this.listJobDraftSuggest = [];
      this.listJobDrafts.map(job => {
        if (job.title.search(text) > -1) {
          this.listJobDraftSuggest.push(job);
        }
      })
    });
  }

  getAllJobDraft() {
    this.isLoading = true;
    this.listJobDraftSuggest = this.listJobDrafts;
    this.jobService.getListJobDraft().subscribe(data => {
      this.listJobDrafts = data;
      this.isLoading = false;
      this.checkDuplicateAssessmentDraft();
    }, err => {
      this.isLoading = false;
      this.helperService.showToastError(err);
    })
  }

  checkDuplicateAssessmentDraft() {
    this.listJobDrafts.forEach((jobDraft, index) => {
      jobDraft.listAssessment.forEach(ass => {
        const indexAss = this.listSelectedAssessment.findIndex(assessment => assessment.assessmentId == ass.assessmentId);
        if (indexAss >= 0) this.listJobDrafts[index].isDuplicateAssessment = true;
      })
    })
    this.listJobDraftSuggest = this.listJobDrafts;
  }

  searchJob() {
    this.listJobDraftSuggest = [];
    this.listJobDrafts.map(job => {
      if (job.title.search(this.nameJob) > -1) {
        this.listJobDraftSuggest.push(job);
      }
    })
  }

  showEditJobModal(job, modalAddNewJob) {
    this.currentJobSelect = job;
    this.isPriveJob = job.isPrivate == SCRATCH_JOB_TYPE.PRIVATE;
    this.showModalEditJob(modalAddNewJob);
  }

  editToJob(data) {
    this.isSaveDraft = true;
    this.jobService.editJob(data.job, data.id).subscribe(res => {
      this.isSaveDraft = false;
      this.modalEditJobRef.close();
      this.close.emit();
      if (data.job.type == 'draft') {
        this.helperService.showToastSuccess(MESSAGE.ADD_JOB_DRAFT_SUCCESSFULY);
      } else {
        this.goToCarts();
      }
    }, err => {
      this.isSaveDraft = false;
      this.helperService.showToastError(err);
    })
  }

  goToCarts() {
    this.paymentService.getAllJobInCard().subscribe((cards) => {
      this.subjectService.listCard.next(cards);
      this.router.navigate(['/shopping-card']);
    }, (error) => { });
  }

  showModalEditJob(modalEditJob) {
    this.modalEditJobRef = this.modalService.open(modalEditJob, {
      windowClass: 'modal-add-new-job',
      size: 'xl'
    })
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
