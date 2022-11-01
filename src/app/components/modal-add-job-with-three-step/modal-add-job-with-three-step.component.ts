import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { STEP_CREATE_JOB, JOB_NUMBER_OPENING_RANGE, CLOSE_MODAL_TYPE, TAB_TYPE, SALARY_TYPE, EMPLOYMENT_TYPE } from 'src/app/constants/config';
import { Assesment } from 'src/app/interfaces/assesment';
import { JobCategory } from 'src/app/interfaces/jobCategory';
import { JobLevel } from 'src/app/interfaces/jobLevel';
import { JobService } from 'src/app/services/job.service';
import { HelperService } from 'src/app/services/helper.service';
import { MESSAGE } from 'src/app/constants/message';
import { Job } from 'src/app/interfaces/job';
import { CardSettings } from 'src/app/interfaces/cardInfo';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'ms-modal-add-job-with-three-step',
  templateUrl: './modal-add-job-with-three-step.component.html',
  styleUrls: ['./modal-add-job-with-three-step.component.scss']
})
export class ModalAddJobWithThreeStepComponent implements OnInit {
  @Input() isPriveJob: boolean;
  @Input() shoppingCart: boolean;
  @Input() settingsCard: CardSettings;
  @Input() isTemplate: boolean;
  @Input() isStep2CreateAccount: boolean;
  @Input() isEdditJob: boolean;
  @Input() isAddingJob: boolean;
  @Input() addAssessmentToDraftJob: boolean;
  @Input() activeTab: string;
  @Input() isNotEditField: boolean;
  @Input() isSaveDraft: boolean;
  @Input() listSelectedAssessmentRef: Array<Assesment> = [];
  @Input() job: Job;
  @Input() listLevel: Array<JobLevel> = [];
  @Input() listCategory: Array<JobCategory> = [];
  @Input() listAssessment: Array<Assesment> = [];
  @Output() close = new EventEmitter();
  @Output() add = new EventEmitter();
  @Output() edit = new EventEmitter();

  step: number = STEP_CREATE_JOB.STEP_0;
  stepCreateJob = STEP_CREATE_JOB;
  formAddNewJob: FormGroup;
  tabType = TAB_TYPE;
  listCountry: Array<string> = [];
  listFallUnder: Array<string> = [];
  listState: Array<string> = [];
  listSelectedAssesment: Array<Assesment> = [];
  editModalJob: boolean = false;
  isSubmited: boolean = false;
  isAllowNextStep: boolean = true;

  constructor(
    private subjectService: SubjectService,
    private fb: FormBuilder,
    private helperService: HelperService,
    private jobService: JobService,
    public formatter: NgbDateParserFormatter,
  ) { }

  ngOnInit(): void {
    this.subjectService.isAllowNextStepCreateJob.subscribe(data => this.isAllowNextStep = data);
    this.isPriveJob = this.isPriveJob == undefined ? false : this.isPriveJob;
    this.initForm();
    this.getDataMaster();
    if (!this.isTemplate && !this.isEdditJob) {
      this.formAddNewJob.reset();
      this.job = null;
      this.listAssessment.map((data, index) => {
        this.listAssessment[index].selectJobStatus = false;
      })
    }

    if (this.job) {
      // this.isPriveJob = this.job.isPrivate == 1;
      this.editModalJob = this.isEdditJob;
      this.formAddNewJob.get('title').setValue(this.job.title);
      this.formAddNewJob.get('employment_type').setValue(this.job.employmentType ? this.job.employmentType : EMPLOYMENT_TYPE[0].id);
      this.formAddNewJob.get('salary').setValue(this.job.salary);
      this.formAddNewJob.get('salaryType').setValue(this.job.salaryType);
      this.formAddNewJob.get('description').setValue(this.job.description);
      this.formAddNewJob.get('level').setValue(this.job.levelId);
      this.formAddNewJob.get('fallUnder').setValue(this.job.jobFallUnder);
      this.formAddNewJob.get('specificPercentTravelType').setValue(this.job.specificPercentTravel);
      this.formAddNewJob.get('urgentHiringBadge').setValue(this.job.addUrgentHiringBadge);
      this.formAddNewJob.get('percentTravel').setValue(this.job.percentTravel);
      this.formAddNewJob.get('openings').setValue(this.job.nbrOpen);
      this.formAddNewJob.get('city').setValue(this.job.cityName);
      this.formAddNewJob.get('state').setValue(this.job.stateName);
      this.formAddNewJob.get('category').setValue(this.job.categoryId);
      this.formAddNewJob.get('proposed_conpensation').setValue(this.job.proposedConpensation);
      this.formAddNewJob.get('salary_min').setValue(this.job.salaryMin);
      this.formAddNewJob.get('salary_max').setValue(this.job.salaryMax);
      if (!this.isTemplate || this.editModalJob || this.shoppingCart) {
        this.formAddNewJob.get('startHotJob').setValue(this.job.startHotJob);
        this.formAddNewJob.get('endHotJob').setValue(this.job.endHotJob);
      }
    } else {
      this.editModalJob = false;
    }
  }

  initForm() {
    this.formAddNewJob = this.fb.group({
      title: ['', [Validators.required]],
      salary: [''],
      employment_type: [0, [Validators.required]],
      salaryType: [''],
      salary_min: ['', Validators.min(JOB_NUMBER_OPENING_RANGE.MIN)],
      salary_max: ['', Validators.min(JOB_NUMBER_OPENING_RANGE.MIN)],
      proposed_conpensation: [''],
      bonus: [''],
      description: ['', [Validators.required]],
      benefits: [''],
      level: [''],
      listAssessment: [''],
      expiredDays: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      category: ['0', [Validators.required]],
      fallUnder: ['', [Validators.required]],
      percentTravel: ['', [Validators.required]],
      specificPercentTravelType: [''],
      scheduleJob: ['', [Validators.required]],
      urgentHiringBadge: ['', [Validators.required]],
      openings: ['', [Validators.required, Validators.min(JOB_NUMBER_OPENING_RANGE.MIN), Validators.max(JOB_NUMBER_OPENING_RANGE.MAX)]],
      startHotJob: [''],
      endHotJob: ['']
    })
  }

  continuteStep({ step, next }) {
    if (!this.isAllowNextStep) return;

    if (step == STEP_CREATE_JOB.STEP_0) {
      this.step = next != null ? next : STEP_CREATE_JOB.STEP_1;
      return;
    }
    if (step == STEP_CREATE_JOB.STEP_1) {
      this.step = next != null ? next : STEP_CREATE_JOB.STEP_2;
      return;
    }
    if (step == STEP_CREATE_JOB.STEP_2) {
      this.step = next != null ? next : STEP_CREATE_JOB.STEP_3;
      return;
    }
    if (step == STEP_CREATE_JOB.STEP_3) {
      this.step = next != null ? next : STEP_CREATE_JOB.STEP_3;
      return;
    }
    this.subjectService.isAllowNextStepCreateJob.next(true);
  }

  changeStatusJob(status) {
    this.isPriveJob = status;
  }

  backToStep() {
    if (this.step == STEP_CREATE_JOB.STEP_1) this.step = STEP_CREATE_JOB.STEP_0;
    if (this.step == STEP_CREATE_JOB.STEP_2) this.step = STEP_CREATE_JOB.STEP_1;
    if (this.step == STEP_CREATE_JOB.STEP_3) this.step = STEP_CREATE_JOB.STEP_2;
  }

  submitJob(isSubmited: boolean) {
    if (isSubmited == true) {
      let data = this.convertJobFormData(this.formAddNewJob.value);
      if (this.job && this.isEdditJob) {
        this.edit.emit({
          job: data,
          id: this.job.id
        })
      } else {
        this.add.emit(data);
      }
    }
  }

  convertJobFormData(form, isDraft = false) {
    let assessmentList = [];
    if (form?.listAssessment) {
      assessmentList = form.listAssessment.map(assessment => {
        return {
          assessment_id: assessment.assessmentId,
          point: assessment.point,
          assessment_type: assessment.type
        }
      })
    } else {
      if (this.job?.listAssessment) {
        assessmentList = this.job?.listAssessment.map(assessment => {
          return {
            assessment_id: assessment.assessmentId,
            point: assessment.point,
            assessment_type: assessment.type
          }
        })
      }
    }

    form.salary_min = Number.parseInt(this.jobService.switchSalary(form.salary_min));
    form.salary_max = Number.parseInt(this.jobService.switchSalary(form.salary_max));
    
    let result = {
      title: form.title,
      employment_type: form.employment_type ? form.employment_type : 0,
      add_urgent_hiring_badge: form.urgentHiringBadge ? form.urgentHiringBadge : 0,
      salary: form.proposed_conpensation == '0' ? this.jobService.switchSalary(form.salary) : null,
      desciption: form.description,
      benefits: form.benefits == '' || !form.benefits ? null : form.benefits.toString(),
      jobs_level_id: form.level ? form.level : null,
      jobs_category_ids: form.category,
      nbr_open: form.openings,
      city_name: form.city || '',
      state_name: form.state || '',
      expired_days: Number.parseInt(form.expiredDays),
      salary_type: form.salaryType ? form.salaryType : SALARY_TYPE[0].id,
      bonus: form.bonus ? JSON.stringify(form.bonus) : null,
      job_fall_under: form.fallUnder,
      percent_travel: form.percentTravel,
      specific_percent_travel_type: Number.parseInt(form.specificPercentTravelType),
      schedule_job: form.scheduleJob ? JSON.stringify(form.scheduleJob) : null,
      proposed_conpensation: form.proposed_conpensation,
      salary_min: form.proposed_conpensation == '1' ? form.salary_min : null,
      salary_max: form.proposed_conpensation == '1' ? form.salary_max : null,
      is_private: this.isPriveJob ? 1 : 0,
      featured_start_date: form.startHotJob ? this.convertNbDateToDate(form.startHotJob, 1) : null,
      featured_end_date: form.endHotJob ? this.convertNbDateToDate(form.endHotJob, 2) : null,
      is_make_featured: form.startHotJob && form.endHotJob ? 1 : 0,
      assessments: assessmentList
    }
    if (isDraft) {
      result['type'] = 'draft';
    }
    return result;
  }

  convertNbDateToDate(nbDate, type) {
    // 1: start date, 2: end date
    if (type === 1) {
      nbDate.setHours(0, 0, 0, 0);
    } else {
      nbDate.setHours(23, 59, 59, 999);
    }
    return nbDate;
  }

  async closeModal(type) {
    for (const [key, value] of Object.entries(this.formAddNewJob.value)) {
      if (!value) break;
      let isConfirmed: any;
      if (type === CLOSE_MODAL_TYPE.BUTTON_CLOSE) {
        isConfirmed = await this.helperService.confirmPopup(MESSAGE.CONFIRM_CLOSE, MESSAGE.BTN_CLOSE_TEXT);
      } else {
        if (this.activeTab === this.tabType.ACTIVE && this.editModalJob === true || this.activeTab === this.tabType.DRAFT || this.activeTab === this.tabType.CART) {
          isConfirmed = await this.helperService.confirmPopup(MESSAGE.CONFIRM_CLOSE_ACTIVE, MESSAGE.BTN_YES_TEXT, MESSAGE.BTN_NO_TEXT);
        } else {
          isConfirmed = await this.helperService.confirmPopup(MESSAGE.CONFIRM_ICON_CLOSE, MESSAGE.BTN_DELETE_TEXT, MESSAGE.BTN_SAVE_DRAFT_TEXT);
          if (!isConfirmed) {
            this.addSaveDraft();
          }
          break;
        }
      }
      if (!isConfirmed) {
        return;
      }
      this.close.emit();
      break;
    }
    this.close.emit();
  }

  getDataMaster() {
    this.jobService.getAllCountry().subscribe(listCountry => {
      this.listCountry = listCountry;
    })
    this.jobService.getAllState().subscribe(listState => {
      this.listState = listState;
    })
    this.jobService.getAllFallUnder().subscribe(listFallUnder => {
      this.listFallUnder = listFallUnder;
      this.listFallUnder.sort(function (a, b) { return a.localeCompare(b) });
    })
  }

  saveDraft(data, type) {
    let draftData = data;
    // for (let key in draftData) {
    //   if (!draftData[key]) {
    //     delete draftData[key];
    //   }
    // }
    if (this.job && this.isEdditJob) {
      let data = {
        job: Object.assign({}, draftData, { id: this.job.id }),
        id: this.job.id
      }
      this.edit.emit(data);
    } else {
      this.add.emit(draftData);
    }
  }

  addSaveDraft() {
    let valueForm = this.formAddNewJob.value
    let sumAssessmentPoint = 0;
    const markNoPoint = parseInt(parseInt(Number(((100 - Number(sumAssessmentPoint))) / (this.listSelectedAssesment.filter(item => !item.point).length)).toString()).toFixed(0));
    this.listSelectedAssesment.forEach(assessment => {
      if (!assessment.point) {
        assessment.point = markNoPoint;
        sumAssessmentPoint += markNoPoint;
      }
    })
    let data = this.convertJobFormData(valueForm, true);
    this.saveDraft(data, true);
  }
  checkRequireValueStep0(formAddNewJob) {
    if (formAddNewJob.get('title').value == '' || formAddNewJob.get('title').value == null) return true;
    if (formAddNewJob.get('fallUnder').value == '' || !formAddNewJob.get('fallUnder').value) return true;
    return false;
  }

  checkRequireValueStep1(form) {
    if (form.get('category').value == '' || form.get('category').value == null) return true;
    if (form.get('description').value == '' || form.get('description').value == null) return true;
    return false;
  }

  switchStepHeader(nextStep) {
    this.subjectService.isAllowNextStepCreateJob.next(true);
    this.helperService.markFormGroupTouched(this.formAddNewJob);
    this.subjectService.switchStepCreateJob.next({
      current: this.step,
      next: nextStep
    });
    setTimeout(() => {
      this.continuteStep({ step: this.step, next: nextStep });
    }, 800);
  }
}
