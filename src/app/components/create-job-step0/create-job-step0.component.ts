import { get } from 'lodash';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SCRATCH_JOB_TYPE, STEP_CREATE_JOB } from 'src/app/constants/config';
import { Job } from 'src/app/interfaces/job';
import { HelperService } from 'src/app/services/helper.service';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'ms-create-job-step0',
  templateUrl: './create-job-step0.component.html',
  styleUrls: ['./create-job-step0.component.scss']
})
export class CreateJobStep0Component implements OnInit {
  @Input() job: Job;
  @Input() activeTab: string;
  @Input() listFallUnder: Array<string> = [];
  @Input() tabType: any;
  @Input() editModalJob: boolean;
  @Input() isPriveJob: boolean;
  @Input() isSaveDraft: boolean;
  @Input() formAddNewJob: FormGroup;
  @Output() continuteStep = new EventEmitter();
  @Output() submitDraft = new EventEmitter();
  @Output() changeStatus = new EventEmitter();
  @Output() submit = new EventEmitter();
  @Input() isAddingJob: boolean;
  @Input() isSubmited: boolean;

  isCheckTitleSaveDraft: boolean = false;
  SCRATCH_JOB_TYPE = SCRATCH_JOB_TYPE;
  constructor(
    private subjectService: SubjectService,
    private helperService: HelperService,
  ) { }

  ngOnInit(): void {
    const jobFallUnder = get('this.job', 'jobFallUnder', this.listFallUnder[0]);
    if (!this.formAddNewJob.get('fallUnder').value) this.formAddNewJob.get('fallUnder').setValue(jobFallUnder);
  }

  checkSwicthStep(){
    if (this.formAddNewJob.get('title').value == '' || this.formAddNewJob.get('title').value == null) return true;
    if (!this.isPriveJob && (this.formAddNewJob.get('fallUnder').value == '' || !this.formAddNewJob.get('fallUnder').value)) {
      return true;
    }
    return false
  }

  continuteStep0(form) {
    this.subjectService.isAllowNextStepCreateJob.next(true);
    this.helperService.markFormGroupTouched(this.formAddNewJob);
    if (form.title == '' || form.title == null) return;
    if (!this.isPriveJob && this.checkRequireValue(form)) {
      return;
    }
    this.continuteStep.emit({ step: STEP_CREATE_JOB.STEP_0, next: null });
  }

  addSaveDraft() {
    this.isCheckTitleSaveDraft = false;
    if (this.formAddNewJob.get('title').value == '' || this.formAddNewJob.get('title').value == null) {
      this.isCheckTitleSaveDraft = true;
      return;
    }
    this.submitDraft.emit();
  }

  checkRequireValue(form) {
    if (form.fallUnder == '' || !form.fallUnder) return true;
    return false;
  }

  onItemChange(value) {
    this.isPriveJob = value == SCRATCH_JOB_TYPE.PRIVATE;
    this.changeStatus.emit(this.isPriveJob);
  }

  saveEditJobActive(){
    this.isSubmited = true;
    this.submit.emit(this.isSubmited);
  }

}
