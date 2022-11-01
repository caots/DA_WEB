import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { MessageService } from 'src/app/services/message.service';
import { MESSAGE } from 'src/app/constants/message';
import { HelperService } from 'src/app/services/helper.service';
import { Applicants } from 'src/app/interfaces/applicants';
import { USER_TYPE, REPORT_APPLICANT_MESSAGE, REPORT_EMPLOYER_MESSAGE } from 'src/app/constants/config';

@Component({
  selector: 'ms-modal-report-user',
  templateUrl: './modal-report-user.component.html',
  styleUrls: ['./modal-report-user.component.scss']
})
export class ModalReportUserComponent implements OnInit {
  @Output() close = new EventEmitter();
  @Input() listApplicants: Applicants;
  @Input() isCandidate: boolean;
  @Input() type: number;
  USER_TYPE = USER_TYPE;
  comment: string;
  checkRequire: boolean = false;
  isChecked: boolean = false;
  isCallingApi: boolean = false;
  reportOptionJob: number;
  dataReasonReport: any;

  constructor(
    private helperService: HelperService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.dataReasonReport = this.type === USER_TYPE.EMPLOYER ? REPORT_APPLICANT_MESSAGE : REPORT_EMPLOYER_MESSAGE;
  }

  closeModal() {
    this.close.emit();
  }

  submit() {
    const otherReason = this.dataReasonReport.find(x => x.title === "Other");
    if (!this.comment && this.reportOptionJob == otherReason.id) {
      this.checkRequire = true;
      return;
    }
    let data = this.checkProcess();
    if (this.comment) {
      data = { ...data, ...{ note: this.comment } }
    }
    this.isCallingApi = true;
    this.messageService.reportUser(data).subscribe(res => {
      this.closeModal();
      this.helperService.showToastSuccess(MESSAGE.REPORT_USER_SUCCESSFULY);
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
      userId: this.listApplicants.userId,
      jobId: this.listApplicants.jobId,
    }
    return data;
  }

  onChange() {
    if (this.comment) {
      this.checkRequire = false;
    }
  }

}
