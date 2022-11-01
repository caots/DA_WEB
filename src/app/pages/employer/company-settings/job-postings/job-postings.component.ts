import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import {
  PAGING,
  MODE,
  PAYMENT_STATUS,
  SEARCH_JOB_TYPE,
  CREATE_JOB_TYPE,
  SCRATCH_JOB_TYPE
} from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { Assesment } from 'src/app/interfaces/assesment';
import { Job } from 'src/app/interfaces/job';
import { JobCategory } from 'src/app/interfaces/jobCategory';
import { JobLevel } from 'src/app/interfaces/jobLevel';
import { PaginationConfig } from 'src/app/interfaces/paginattionConfig';
import { HelperService } from 'src/app/services/helper.service';
import { JobService } from 'src/app/services/job.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'ms-job-postings',
  templateUrl: './job-postings.component.html',
  styleUrls: ['./job-postings.component.scss']
})

export class JobPostingsComponent implements OnInit {
  modalNewJobFromScratchOrTemplateRef: NgbModalRef;
  modalAddJobFromTemplateRef: NgbModalRef;
  modalAddANewJobRef: NgbModalRef;

  @Output() next = new EventEmitter();
  listJob: Array<Job> = [];
  editingJob: Job;
  cardMode = MODE;
  isAddingJob: boolean;
  isEdditJob: boolean;
  isSaveDraft: boolean;
  isUpdatingStep: boolean;
  isLoadingListJob: boolean;
  paginationConfig: PaginationConfig;
  modalAddJobRef: NgbModalRef;
  listLevel: Array<JobLevel> = [];
  listCategory: Array<JobCategory> = [];
  listAssessment: Array<Assesment> = [];
  isTemplate: boolean = false;
  isPriveJob: boolean;
  lengthJob: number = 0;

  constructor(
    private modalService: NgbModal,
    private jobService: JobService,
    private userService: UserService,
    private authService: AuthService,
    private helperService: HelperService,
    private subjectService: SubjectService,
  ) { }

  ngOnInit(): void {
    this.paginationConfig = {
      currentPage: 0,
      totalRecord: 0,
      maxRecord: PAGING.MAX_ITEM
    }

    this.getListJob();
    this.getDataMaster();
    this.getAllListPreviousJobTemplate({ searchType: SEARCH_JOB_TYPE.All });
  }

  continueStep() {
    this.isUpdatingStep = true;
    this.userService.completeSignUpStep().subscribe(res => {
      this.authService.getUserInfo().subscribe(userInfo => {
        this.next.emit();
        this.isUpdatingStep = false;
        this.authService.saveUser({
          role: userInfo.accountType,
          signUpStep: userInfo.signUpStep
        })
      })
    }, err => {
      this.isUpdatingStep = false;
      this.helperService.showToastSuccess(err);
    })
  }

  showModalAddNewJob(modalAddJob) {
    this.editingJob = null;
    this.modalAddJobRef = this.modalService.open(modalAddJob, {
      windowClass: 'modal-add-new-job',
      size: 'xl'
    })
  }

  showModalEditJob(job, modalAddANewJob) {
    this.editingJob = job; 
    this.isPriveJob = job.isPrivate == SCRATCH_JOB_TYPE.PRIVATE;
    this.isEdditJob = true;
    this.modalAddANewJobRef = this.modalService.open(modalAddANewJob, {
      windowClass: 'modal-add-a-new-job',
      size: 'xl'
    })
  }

  async deleteJob(job) {
    const isConfirm = await this.helperService.confirmPopup(MESSAGE.TITLE_CONFIRM_DELETE_JOB);
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
    const isConfirm = await this.helperService.confirmPopup(MESSAGE.CONFIRM_DUPPLICATE_JOB);
    if (isConfirm) {
      this.jobService.duplicateJob(job.id).subscribe(res => {
        this.helperService.showToastSuccess(MESSAGE.DUPLICATE_JOB_SUCCESSFULLY);
        this.getListJob();
      }, err => {
        this.helperService.showToastError(err);
      })
    }
  }

  addJob(job) {
    if(job.type == 'draft') {
      this.isSaveDraft = true;
    } else {
      this.isAddingJob = true;
    }
    this.jobService.createJob(job).subscribe(res => {
      if(job.type == 'draft') {
        this.isSaveDraft = false;
      } else {
        this.isAddingJob = false;
      }
      this.modalAddANewJobRef.close();
      this.getListJob();
      if(job.type == 'draft') {
        this.helperService.showToastSuccess(MESSAGE.ADD_JOB_DRAFT_SUCCESSFULY);
      } else{
        this.helperService.showToastSuccess(MESSAGE.ADD_JOB_SUCCESSFULY);
      }
    }, err => {
      if(job.type == 'draft') {
        this.isSaveDraft = false;
      } else {
        this.isAddingJob = false;
      }
      this.helperService.showToastError(err);
    })
  }

  editJob(data) {
    this.isAddingJob = true;
    this.jobService.editJob(data.job, data.id).subscribe(res => {
      this.isAddingJob = false;
      this.modalAddANewJobRef.close();
      this.getListJob();
      this.helperService.showToastSuccess(MESSAGE.UPDATE_JOB_SUCCESSFULY);
    }, err => {
      this.isAddingJob = false;
      this.helperService.showToastError(err);
    })
  }

  paginationJob(page) {
    this.paginationConfig.currentPage = page;
    this.getListJob();
  }

  getListJob() {
    this.isLoadingListJob = true;
    this.jobService.getListJob({
      page: this.paginationConfig.currentPage,
      pageSize: this.paginationConfig.maxRecord,
      // paymentStatus: PAYMENT_STATUS.ACTIVE
      searchType: 'setting'
    }).subscribe(data => {
      this.isLoadingListJob = false;
      this.listJob = data.listJob;
      this.paginationConfig.totalRecord = data.total;
    }, err => {
      this.helperService.showToastError(err);
    })
  }

  getDataMaster() {
    this.jobService.getListAssessMent().subscribe(listAssessment => {
      this.listAssessment = listAssessment;
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

  showModalCreateNewJob(type, modalAddNewJob, modalAddJobFromtemplate) {
    this.closeModalNewJob();
    if (type == CREATE_JOB_TYPE.SCRATCH) {
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

  showModalAddNewJobFromScratchOrTemplate(modalNewJobFromScratchOrTemplate, modalAddANewJob) {
    if (this.lengthJob <= 0) {
      this.modalAddANewJobRef = this.modalService.open(modalAddANewJob, {
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

  getAllListPreviousJobTemplate(condition) {
    this.jobService.getListJob(condition).subscribe(data => {
      this.lengthJob = data.total;
    }, err => {
      this.helperService.showToastError(err);
    })
  }

  addJobFromTemplate(job: Job, modalAddNewJob) {
    this.editingJob = job;
    this.isPriveJob = job.isPrivate == SCRATCH_JOB_TYPE.PRIVATE;
    this.isTemplate = true;
    this.isEdditJob = true;
    this.modalAddANewJobRef = this.modalService.open(modalAddNewJob, {
      windowClass: 'modal-add-a-new-job',
      size: 'xl'
    });
    this.modalAddJobFromTemplateRef.close();
  }

  closeModalNewJob() {
    this.modalNewJobFromScratchOrTemplateRef.close();
  }
}
