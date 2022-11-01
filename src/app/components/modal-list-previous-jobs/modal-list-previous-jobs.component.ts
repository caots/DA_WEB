import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { PAGING, SEARCH_JOB_TYPE } from 'src/app/constants/config';
import { Job } from 'src/app/interfaces/job';
import { PaginationConfig } from 'src/app/interfaces/paginattionConfig';
import { HelperService } from 'src/app/services/helper.service';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'ms-modal-list-previous-jobs',
  templateUrl: './modal-list-previous-jobs.component.html',
  styleUrls: ['./modal-list-previous-jobs.component.scss']
})
export class ModalListPreviousJobsComponent implements OnInit {
  @Output() close = new EventEmitter();
  @Output() addJobFromTemplate = new EventEmitter();
  paginationConfig: PaginationConfig;
  textSearch: string;
  listPreviousJobTemplate: Job[];
  isLoadingJob: boolean = true;
  jobcheckedTemplate: Job;
  condition: any;
  constructor(
    private jobService: JobService,
    private helperService: HelperService
  ) { }

  ngOnInit(): void {
    this.paginationConfig = {
      currentPage: 0,
      totalRecord: 0,
      maxRecord: PAGING.MAX_ITEM,
    }
    this.condition = {
      page: 0,
      pageSize: PAGING.MAX_ITEM,
      q: '',
      searchType: SEARCH_JOB_TYPE.All
    }
    this.getAllListPreviousJobTemplate(this.condition);
  }

  onSearchJob() {
    this.condition.q = this.textSearch;
    this.getAllListPreviousJobTemplate(this.condition);
  }

  closeModal() {
    this.close.emit();
  }

  paginationJob(page) {
    this.paginationConfig.currentPage = page;
    this.condition.page = page;
    this.getAllListPreviousJobTemplate(this.condition);
  }

  nextStep() {
    this.addJobFromTemplate.emit(this.jobcheckedTemplate);
  }

  getAllListPreviousJobTemplate(condition) {
    this.isLoadingJob = true;
    this.jobService.getListJob(condition).subscribe(data => {
      this.listPreviousJobTemplate = data.listJob;
      this.paginationConfig.totalRecord = data.total;
      this.isLoadingJob = false;
    }, err => {
      this.isLoadingJob = false;
      this.helperService.showToastError(err);
    })
  }

  checkTemplateJob(id) {
    const index = this.listPreviousJobTemplate.findIndex(job => job.id == id);
    if (index < 0) return;
    if (this.listPreviousJobTemplate[index].statusCheckTemplate) {
      this.listPreviousJobTemplate[index] = Object.assign({}, this.listPreviousJobTemplate[index], { statusCheckTemplate: false });
      this.jobcheckedTemplate = null;
    } else {
      this.listPreviousJobTemplate[index] = Object.assign({}, this.listPreviousJobTemplate[index], { statusCheckTemplate: true });
      this.jobcheckedTemplate = this.listPreviousJobTemplate[index];
      this.listPreviousJobTemplate.map((job, i) => {
        if (index != i) {
          this.listPreviousJobTemplate[i] = Object.assign({}, this.listPreviousJobTemplate[i], { statusCheckTemplate: false });
        }
      });
    }
  }
}
