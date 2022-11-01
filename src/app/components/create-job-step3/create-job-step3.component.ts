import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HelperService } from 'src/app/services/helper.service';
import { LIST_BENEFITS, JOB_BONUS, SALARY_TYPE, PROPOSED_CONPENSATION, ASSESSMENT_POINT_RANGE, STEP_CREATE_JOB } from 'src/app/constants/config';
import { Job } from 'src/app/interfaces/job';
import { JobService } from 'src/app/services/job.service';
import { SubjectService } from 'src/app/services/subject.service';
@Component({
  selector: 'ms-create-job-step3',
  templateUrl: './create-job-step3.component.html',
  styleUrls: ['./create-job-step3.component.scss']
})
export class CreateJobStep3Component implements OnInit {
  @Input() isPriveJob: boolean;
  @Input() isSubmited: boolean;
  @Input() isStep2CreateAccount: boolean;
  @Input() shoppingCart: boolean;
  @Input() isTemplate: boolean;
  @Input() addAssessmentToDraftJob: boolean;
  @Input() job: Job;
  @Input() tabType: any;
  @Input() formAddNewJob: FormGroup;
  @Input() isAddingJob: boolean;
  @Input() activeTab: string;
  @Input() isSaveDraft: boolean;
  @Input() editModalJob: boolean;
  @Output() close = new EventEmitter();
  @Output() submit = new EventEmitter();
  @Output() backStep = new EventEmitter();
  @Output() submitDraft = new EventEmitter();
  listBonus: any[] = [];
  listBenefistSelected: any[] = [];
  listBenefits = LIST_BENEFITS;
  jobsBonus = JOB_BONUS;
  specifyText: string = '';
  salaryType = SALARY_TYPE;
  valueSalaryType: number = SALARY_TYPE[0].id;
  proposesTypes = PROPOSED_CONPENSATION;
  proposedConpensation: number = PROPOSED_CONPENSATION[0].id;
  ASSESSMENT_POINT_RANGE = ASSESSMENT_POINT_RANGE;
  isShowErrorStep3: boolean = false;
  salaryMin: any = "";
  salaryMax: any = "";
  warningSalary: string;
  constructor(
    private subjectService: SubjectService,
    private jobService: JobService,
    private helperService: HelperService,
  ) { }

  ngOnInit(): void {
    this.listBenefits.map((data, index) => {
      this.listBenefits[index].status = false;
    })
    this.jobsBonus.map((data, index) => {
      this.jobsBonus[index].status = false;
    })
    if (this.formAddNewJob.get('salary').value) {
      this.formAddNewJob.get('salary').setValue(Number.parseInt(this.jobService.switchSalary(this.formAddNewJob.get('salary').value)));
      this.formAddNewJob.get('salary').setValue(this.helperService.formatSalary(this.formAddNewJob.get('salary').value));
    }
    if (!this.job || !this.isTemplate) {
      if (this.formAddNewJob.get('salaryType').value) this.valueSalaryType = this.formAddNewJob.get('salaryType').value;
      if (this.formAddNewJob.get('salary_min').value) this.salaryMin = this.helperService.formatSalary(Number.parseInt(this.jobService.switchSalary(this.formAddNewJob.get('salary_min').value)));
      if (this.formAddNewJob.get('salary_max').value) this.salaryMax = this.helperService.formatSalary(Number.parseInt(this.jobService.switchSalary(this.formAddNewJob.get('salary_max').value)));
      if (this.formAddNewJob.get('proposed_conpensation').value) this.proposedConpensation = this.formAddNewJob.get('proposed_conpensation').value;
      // bonus
      if (this.formAddNewJob.get('bonus').value) {
        this.jobsBonus.map((data, index) => {
          this.formAddNewJob.get('bonus').value.map(bonus => {
            if (data.id == bonus.id) {
              this.jobsBonus[index].status = true;
              this.listBonus.push(this.jobsBonus[index]);
            }
            if (bonus.id == this.jobsBonus.length - 1) this.specifyText = data.title;
          })
        });
      }
      // benefits
      if (this.formAddNewJob.get('benefits').value) {
        this.listBenefits.map((data, index) => {
          this.formAddNewJob.get('benefits').value.map(benefit => {
            if (data.id == benefit) {
              this.listBenefits[index].status = true;
              this.listBenefistSelected.push(benefit);
            }
          })
        });
      }
      return;
    }
    // salary type
    this.valueSalaryType = this.job.salaryType;
    this.proposedConpensation = this.job.proposedConpensation;
    this.salaryMin = this.helperService.formatSalary(this.job.salaryMin);
    this.salaryMax = this.helperService.formatSalary(this.job.salaryMax);
    // bonus
    this.listBonus = JSON.parse(this.job.bonus);
    if (this.listBonus) {
      this.jobsBonus.map((schedule, index) => {
        this.listBonus.map(data => {
          if (data.id == schedule.id) this.jobsBonus[index].status = true;
          if (data.id == this.jobsBonus.length - 1) this.specifyText = data.title;
        })
      });
      this.formAddNewJob.get('bonus').setValue(this.listBonus);
    } else {
      this.listBonus = [];
    }
    // benefits
    this.listBenefistSelected = this.job.benefits && this.job.benefits.split(',');
    if (this.listBenefistSelected) {
      this.listBenefits.map((benefits, index) => {
        this.listBenefistSelected.map(id => {
          id = Number.parseInt(id);
          if (id == benefits.id) this.listBenefits[index].status = true;
        })
      });
      this.formAddNewJob.get('benefits').setValue(this.listBenefistSelected);
    } else {
      this.listBenefistSelected = [];
    }
  }

  selectOptionSalary(value) {
    this.valueSalaryType = value;
    this.formAddNewJob.get('salaryType').setValue(this.valueSalaryType);
  }

  selectBonus(bonus) {
    const index = this.jobsBonus.findIndex(c => c.id === bonus.id);
    this.jobsBonus[index].status = !bonus.status;;
    if (!this.jobsBonus[index].status && this.listBonus.length > 0) {
      const index = this.listBonus.findIndex(c => c.id === bonus.id);
      this.listBonus.splice(index, 1);
    } else {
      this.listBonus.push(bonus);
    }
    this.addBonusToForm();
  }

  changeProposesTypes() {
    this.formAddNewJob.get('proposed_conpensation').setValue(this.proposedConpensation);
  }

  selectBenefits(benefits) {
    const index = this.listBenefits.findIndex(c => c.id === benefits.id);
    this.listBenefits[index].status = !benefits.status;
    if (!this.listBenefits[index].status && this.listBenefistSelected.length > 0) {
      const index = this.listBenefistSelected.findIndex(id => id === benefits.id);
      this.listBenefistSelected.splice(index, 1);
    } else {
      this.listBenefistSelected.push(benefits.id);
    }
    this.formAddNewJob.get('benefits').setValue(this.listBenefistSelected);
  }

  closeModal(type) {
    this.close.emit(type);
  }

  addBonusToForm(submit = false) {
    if (this.listBonus) {
      this.listBonus.map((bonus, index) => {
        if (bonus.id == this.jobsBonus.length - 1) this.listBonus[index].title = this.specifyText;
        if (submit) delete this.listBonus[index].status;
      })
    }
    this.formAddNewJob.get('bonus').setValue(this.listBonus);
  }

  addFormToData() {
    this.salaryMax = Number.parseInt(this.jobService.switchSalary(this.salaryMax));
    this.salaryMin = Number.parseInt(this.jobService.switchSalary(this.salaryMin));
    this.helperService.markFormGroupTouched(this.formAddNewJob);
    this.addBonusToForm(true);
    this.formAddNewJob.get('benefits').setValue(this.listBenefistSelected);
    this.formAddNewJob.get('salaryType').setValue(this.valueSalaryType);
    this.formAddNewJob.get('salary_max').setValue(this.salaryMax == '' ? null : Number.parseInt(this.salaryMax));
    this.formAddNewJob.get('salary_min').setValue(this.salaryMin == '' ? null : Number.parseInt(this.salaryMin));
  }

  checkSalary() {
    const valueSalaryMax = Number.parseInt(this.jobService.switchSalary(this.salaryMax));
    const valueSalaryMin = Number.parseInt(this.jobService.switchSalary(this.salaryMin));

    if (this.proposedConpensation == PROPOSED_CONPENSATION[1].id) {
      if (this.salaryMin == '' || !this.salaryMin) {
        this.warningSalary = "Min value is required!";
        this.salaryMin = "";
        if (this.salaryMax == '' || !this.salaryMax) this.salaryMax = "";
        return true;
      } else this.warningSalary = null;
      if (this.salaryMax == '' || !this.salaryMax) {
        this.warningSalary = "Max value is required!";
        this.salaryMax = "";
        if (this.salaryMin == '' || !this.salaryMin) this.salaryMin = "";
        return true;
      } else this.warningSalary = null;
      if (valueSalaryMax <= 0 || valueSalaryMin <= 0) return true;
      if (valueSalaryMax <= valueSalaryMin) {
        this.warningSalary = "Max value must be greater than Min value!";
        return true;
      } else this.warningSalary = null;
    } else {
      this.warningSalary = null;
    }
    this.salaryMax = Number.parseInt(this.jobService.switchSalary(this.salaryMax));
    this.salaryMin = Number.parseInt(this.jobService.switchSalary(this.salaryMin));
    return false;
  }

  addSaveDraft() {
    this.isShowErrorStep3 = true;
    this.addFormToData();
    // if (this.checkSalary()) {
    //   this.isSubmited = false;
    //   return;
    // }
    // this.isSubmited = true;
    this.submitDraft.emit();
  }

  submitJob(form) {
    this.subjectService.isAllowNextStepCreateJob.next(true);
    this.isShowErrorStep3 = true;
    if (this.checkSalary()) {
      this.isSubmited = false;
      return;
    }
    this.addFormToData();
    this.isSubmited = true;
    this.submit.emit(this.isSubmited);
  }

  backToStep() {
    this.backStep.emit();
  }
}
