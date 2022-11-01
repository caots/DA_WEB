import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { JobService } from 'src/app/services/job.service';
import { MESSAGE } from 'src/app/constants/message';
import { HelperService } from 'src/app/services/helper.service';
import { REASON_REPORT_JOB } from 'src/app/constants/config'

@Component({
  selector: 'ms-modal-report-job',
  templateUrl: './modal-report-job.component.html',
  styleUrls: ['./modal-report-job.component.scss']
})
export class ModalReportJobComponent implements OnInit {
  @Output() close = new EventEmitter();
  @Input() company_id: number;
  @Input() job_id: number;
  comment: string;
  checkRequire: boolean = false;
  isChecked: boolean = false;
  isCallingApi: boolean = false;
  reportOptionJob: number;
  dataReasonReport = REASON_REPORT_JOB;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private helperService: HelperService,
    private jobService: JobService
  ) { }

  ngOnInit(): void {
  }

  closeModal() {
    this.close.emit();
  }

  submit() {
    const otherReason = REASON_REPORT_JOB.find(x => x.title === "Other");
    if (this.reportOptionJob == otherReason.id && !this.comment) {
      this.checkRequire = true;
      return;
    }
    let data = this.checkProcess();
    if (this.comment) {
      data = { ...data, ...{ note: this.comment } }
    }
    this.isCallingApi = true;
    this.jobService.reportJob(data).subscribe(res => {
      this.closeModal();
      this.helperService.showToastSuccess(MESSAGE.REPORT_JOB_SUCCESSFULY);
    }, errorRes => {
      this.helperService.showToastError(errorRes);
      this.isCallingApi = false;
    });
  }

  onItemChange(value) {
    this.isChecked = true;
    this.reportOptionJob = value;
  }

  checkProcess() {
    let data = {};
    data = {
      reportType: this.reportOptionJob,
      companyId: this.company_id,
      jobId: this.job_id
    }
    return data;
  }

  onChange() {
    if (this.comment) {
      this.checkRequire = false;
    }
  }

}
