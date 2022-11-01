import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { JobService } from 'src/app/services/job.service';
import { MESSAGE } from 'src/app/constants/message';
import { HelperService } from 'src/app/services/helper.service';
@Component({
  selector: 'ms-modal-report-company',
  templateUrl: './modal-report-company.component.html',
  styleUrls: ['./modal-report-company.component.scss']
})

export class ModalReportCompanyComponent implements OnInit {
  @Output() close = new EventEmitter();
  @Input() company_id: number;
  comment: string;
  checkRequire: boolean = false;
  isChecked: boolean = false;
  isCallingApi: boolean = false;
  dataReasonReport: any = [
    {
      id: 0,
      title: 'Fraud',
      name: 'type_fraud',
      isCheckbox: false
    },
    {
      id: 1,
      title: 'Wrong or misleading information',
      name: 'type_wrongOrMisleadingInformation',
      isCheckbox: false
    },
    {
      id: 2,
      title: 'Harassing the applicants',
      name: 'type_harrassingTheApplicants',
      isCheckbox: false
    },
    {
      id: 3,
      title: 'Other',
      name: 'type_other',
      isCheckbox: false
    },
  ]

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
   const isCheckboxOther = this.dataReasonReport.find(op => op.id == 3)
    if (!this.comment && isCheckboxOther.isCheckbox) {
      this.checkRequire = true;
      return;
    }
    let data = this.checkProcess();
    if (this.comment) {
      data = { ...data, ...{ note: this.comment } }
    }
    this.isCallingApi = true;
    this.jobService.reportCompany(data).subscribe(res => {
      this.closeModal();
      this.helperService.showToastSuccess(MESSAGE.REPORT_COMPANY_SUCCESSFULY);
    }, errorRes => {
      this.helperService.showToastError(errorRes);
      this.isCallingApi = false;
    });
  }

  onCheckboxChange(option, index) {
    this.dataReasonReport.forEach(element => {
      if (element.id == index) {
        element.isCheckbox = !element.isCheckbox
      }
    });
    this.isChecked = this.dataReasonReport.find(op => op.isCheckbox)
  }

  checkProcess() {
    let data = {};
    this.dataReasonReport.forEach(element => {
      data[`${element.name}`] = element.isCheckbox
    });
    data = { ...data, ...{ company_id: this.company_id } }
    return data;
  }

  onChange() {
    if(this.comment) {
      this.checkRequire = false;
    }
  }
}
