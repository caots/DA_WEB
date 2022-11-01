import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbModal, NgbModalRef, NgbDate, NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { JOB_NUMBER_OPENING_RANGE } from 'src/app/constants/config';
import { Assesment } from 'src/app/interfaces/assesment';
import { Job } from 'src/app/interfaces/job';
import { JobCategory } from 'src/app/interfaces/jobCategory';
import { JobLevel } from 'src/app/interfaces/jobLevel';
import { JobService } from 'src/app/services/job.service';
import { HelperService } from 'src/app/services/helper.service';
import { MESSAGE } from 'src/app/constants/message';

@Component({
  selector: 'ms-modal-add-job',
  templateUrl: './modal-add-job.component.html',
  styleUrls: ['./modal-add-job.component.scss']
})

export class ModalAddJobComponent implements OnInit {
  @Input() job: Job;
  @Input() isAddingJob: boolean;
  @Input() activeTab: string;
  @Input() isSaveDraft: boolean;
  @Input() addAssessmentToDraftJob: boolean;
  @Input() listLevel: Array<JobLevel> = [];
  @Input() listSelectedAssessmentRef: Array<Assesment> = [];
  @Input() listCategory: Array<JobCategory> = [];
  @Input() listAssessment: Array<Assesment> = [];
  @Output() close = new EventEmitter();
  @Output() add = new EventEmitter();
  @Output() edit = new EventEmitter();
  formAddNewJob: FormGroup;
  expireDay: number;
  checkedDatepicker: boolean = false;
  currentExpireValue: any = CURRENT_DATE;
  placeHolderExpired: NgbDateStruct;
  initDateValue: any = CURRENT_DATE;
  maxExpireDateValue: any;
  editingAssessment: Assesment;
  listCountry: Array<string> = [];
  listState: Array<string> = [];
  messageValidateAssessment: string;
  openingNumberRange = JOB_NUMBER_OPENING_RANGE;
  listSelectedAssesment: Array<Assesment> = [];
  modalAddAssessmentTagRef: NgbModalRef;
  modalEditAssessmentTagRef: NgbModalRef;
  tabType = TAB_TYPE;
  editModalJob: boolean;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public formatter: NgbDateParserFormatter,
    private modalService: NgbModal,
    private helperService: HelperService,
    private jobService: JobService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getDataMaster();
    this.maxExpireDateValue = this.setMaxExpireDate(new Date(), 45);

    if (this.job) {
      this.editModalJob = true;
      this.formAddNewJob.get('title').setValue(this.job.title);
      this.formAddNewJob.get('salary').setValue(this.job.salary);
      this.formAddNewJob.get('description').setValue(this.job.description);
      this.formAddNewJob.get('level').setValue(this.job.levelId);
      this.formAddNewJob.get('benefits').setValue(this.job.benefits);
      this.formAddNewJob.get('openings').setValue(this.job.nbrOpen);
      this.formAddNewJob.get('city').setValue(this.job.cityName);
      this.formAddNewJob.get('state').setValue(this.job.stateName);
      this.formAddNewJob.get('category').setValue(this.job.categoryId);
      if (this.job.expiredAt) {
        this.placeHolderExpired = this.setValueDatePicker(this.job.expiredAt);
        let timeDiff = Math.abs(this.job.expiredAt.getTime() - new Date().getTime());
        this.expireDay = Math.ceil(timeDiff / (1000 * 3600 * 24));
      } else {
        this.expireDay = this.job.expiredDays;
        let timeDiff = Math.abs(new Date().getTime() - this.job.createdAt.getTime());
        let dateCurrent = Math.ceil(timeDiff / (1000 * 3600 * 24));
        this.placeHolderExpired = this.setMaxExpireDate(new Date(), this.job.expiredDays - dateCurrent);
      }

      let listSelectedAssesment = [];
      this.listAssessment.forEach(assessment => {
        let existedAssessment = this.job.listAssessment.find(item => item.assessmentId == assessment.assessmentId);
        if (existedAssessment) {
          listSelectedAssesment.push({
            ...assessment,
            point: existedAssessment.point
          })
        }
      })
      if (this.listSelectedAssessmentRef) {
        this.listSelectedAssessmentRef.map(ass => {
          listSelectedAssesment.push({ ...ass, point: 0 })
        })
        let newListAssesment = this.uniqueAsessment(listSelectedAssesment);
        listSelectedAssesment = [];
        newListAssesment.map(data => {
          listSelectedAssesment.push(Object.assign({}, data, { point: 0 }));
        })
      }
      this.listSelectedAssesment = listSelectedAssesment;
    } else {
      this.editModalJob = false;
      this.placeHolderExpired = CURRENT_DATE;
      this.listSelectedAssesment = this.listSelectedAssessmentRef && this.listSelectedAssessmentRef;
    }
  }


  uniqueAsessment(arrJob) {
    var newArr = []
    for (var i = 0; i < arrJob.length; i++) {
      let index = newArr.findIndex(arr => arr.assessmentId === arrJob[i].assessmentId);
      if (index < 0) {
        newArr.push(arrJob[i])
      }
    }
    return newArr
  }

  initForm() {
    this.formAddNewJob = this.fb.group({
      title: ['', [Validators.required]],
      salary: ['', [Validators.required]],
      description: ['', [Validators.required]],
      benefits: ['', [Validators.required]],
      level: [''],
      expiredDays: [''],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      category: ['', [Validators.required]],
      openings: ['', [Validators.required, Validators.min(JOB_NUMBER_OPENING_RANGE.MIN), Validators.max(JOB_NUMBER_OPENING_RANGE.MAX)]]
    })
  }

  setMaxExpireDate(date, number) {
    date.setDate(new Date().getDate() + number);
    return this.setValueDatePicker(date);
  }

  setValueDatePicker(date) {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
  }

  selectCountry = (text$: Observable<string>) => {
    return text$.pipe(
      distinctUntilChanged(),
      map(query => {
        return this.helperService.autoCompleteFilter(this.listCountry, query);
      })
    )
  }

  selectState = (text$: Observable<string>) => {
    return text$.pipe(
      distinctUntilChanged(),
      map(query => {
        return this.helperService.autoCompleteFilter(this.listState, query);
      })
    )
  }

  addNewAssessment(modalAddAssessment) {
    this.modalAddAssessmentTagRef = this.modalService.open(modalAddAssessment, {
      windowClass: 'modal-add-new-assessment',
      size: 'lg'
    })
  }

  addAssessment(assessment) {
    if (!this.listSelectedAssesment.find(item => item.id == assessment.id)) {
      this.listSelectedAssesment.push({
        ...assessment,
      })
    }
  }

  onDateSelectionTo(date: NgbDate) {
    let myDate = new Date(date.year, date.month - 1, date.day);
    let currentDate = new Date();
    myDate.setHours(23, 59, 59, 999);
    currentDate.setHours(0, 0, 0, 0);
    var timeDiff = Math.abs(myDate.getTime() - currentDate.getTime());
    this.expireDay = Math.ceil(timeDiff / (1000 * 3600 * 24));
    this.formAddNewJob.get('expiredDays').setValue(this.expireDay);
    this.currentExpireValue = this.setValueDatePicker(myDate);
    this.placeHolderExpired = date;
  }

  removeAssessment(assessment) {
    this.listSelectedAssesment = this.listSelectedAssesment.filter(item => {
      return item.id != assessment.id;
    })
  }

  updateAssessment(assessment) {
    this.listSelectedAssesment.forEach(item => {
      if (item.id == assessment.id) {
        item.name = assessment.name;
        item.point = parseInt(assessment.point);
      }
    })

    this.modalEditAssessmentTagRef.close();
  }

  submitJob(form) {
    this.helperService.markFormGroupTouched(this.formAddNewJob);
    this.checkedDatepicker = true;
    if (!this.checkValidMarkAssessment() || this.formAddNewJob.invalid) {
      return;
    }
    let data = this.convertJobFormData(form);
    if (this.job) {
      this.edit.emit({
        job: data,
        id: this.job.id
      })
    } else {
      this.add.emit(data);
    }
  }

  checkValidMarkAssessment() {
    let sumAssessmentPoint = 0;
    this.listSelectedAssesment.forEach(assessent => {
      if (assessent.point) {
        sumAssessmentPoint += assessent.point;
      }
    })
    if (!this.expireDay) {
      return false;
    }
    if (sumAssessmentPoint > 100) {
      this.messageValidateAssessment = MESSAGE.SUM_POINT_TOO_MAX;
      return false;
    }

    if (sumAssessmentPoint < 100 && this.listSelectedAssesment.filter(item => !item.point).length == 0 && sumAssessmentPoint > 0) {
      this.messageValidateAssessment = MESSAGE.SUM_POINT_TOO_MAX;
      return false;
    }
    const markNoPoint = parseInt(parseInt(Number(((100 - Number(sumAssessmentPoint))) / (this.listSelectedAssesment.filter(item => !item.point).length)).toString()).toFixed(0));
    this.listSelectedAssesment.forEach(assessment => {
      if (!assessment.point) {
        assessment.point = markNoPoint;
        sumAssessmentPoint += markNoPoint;
      }
    })
    let numberOfSurplus = 100 - sumAssessmentPoint;

    if (this.listSelectedAssesment.length) {
      for (let i = 0; i <= this.listSelectedAssesment.length; i++) {
        if (numberOfSurplus > 0) {
          this.listSelectedAssesment[i].point = this.listSelectedAssesment[i].point + 1;
          sumAssessmentPoint = sumAssessmentPoint + 1;
          numberOfSurplus = numberOfSurplus - 1;
        } else {
          sumAssessmentPoint = 100;
          break;
        }
      }
    }

    if (this.listSelectedAssesment.find(assessment => assessment.point == 0)) {
      this.messageValidateAssessment = MESSAGE.POINT_EXIST_ZERO;
      return false;
    }

    if (this.listSelectedAssesment.filter(item => !item.point).length > 0) {
      return true;
    }
    if (this.listSelectedAssesment.find(assessment => !assessment.point)) {
      this.messageValidateAssessment = MESSAGE.POINT_EXIST_ZERO;
      return false;
    }

    this.messageValidateAssessment = '';
    return true;
  }

  showEditAssessment(assesment, modalEditAssessmentTag) {
    this.editingAssessment = assesment;
    this.modalEditAssessmentTagRef = this.modalService.open(modalEditAssessmentTag, {
      windowClass: 'modal-edit-assessment-tag'
    })
  }

  deleteAssessment(assesment) {
    this.listSelectedAssesment = this.listSelectedAssesment.filter(item => item.id != assesment.id);
  }

  getDataMaster() {
    this.jobService.getAllCountry().subscribe(listCountry => {
      this.listCountry = listCountry;
    })
    this.jobService.getAllState().subscribe(listState => {
      this.listState = listState;
    })
  }

  async closeModal(type) {
    for (const [key, value] of Object.entries(this.formAddNewJob.value)) {
      if (value) {
        let isConfirmed: any;
        if (type === 1) {
          isConfirmed = await this.helperService.confirmPopup(MESSAGE.CONFIRM_CLOSE, MESSAGE.BTN_CLOSE_TEXT);
        } else {
          if(this.activeTab === this.tabType.ACTIVE && this.editModalJob === true || this.activeTab === this.tabType.DRAFT){
            isConfirmed = await this.helperService.confirmPopup(MESSAGE.CONFIRM_CLOSE_ACTIVE, MESSAGE.BTN_YES_TEXT, MESSAGE.BTN_NO_TEXT);
          }else{
            isConfirmed = await this.helperService.confirmPopup(MESSAGE.CONFIRM_ICON_CLOSE, MESSAGE.BTN_DELETE_TEXT, MESSAGE.BTN_SAVE_DRAFT_TEXT);
          }
        }
        if (!isConfirmed) {
          return;
        } else {
          this.close.emit();
        }
        break;
      }
    }
    this.close.emit();
  }

  convertJobFormData(form, isDraft = false) {
    let result = {
      title: form.title,
      salary: this.jobService.switchSalary(form.salary),
      desciption: form.description,
      benefits: form.benefits,
      jobs_level_id: form.level ? form.level : null,
      jobs_category_ids: form.category,
      nbr_open: form.openings,
      city_name: form.city,
      state_name: form.state,
      expired_days: this.expireDay,
      assessments: this.listSelectedAssesment.map(assessment => {
        return {
          assessment_id: assessment.assessmentId,
          point: assessment.point,
          assessment_type: assessment.type
        }
      })
    }

    if (isDraft) {
      result['type'] = 'draft';
    }

    return result;
  }

  hasFormDataValue(data) {
    // const listFieldRequired = ['title', 'salary'];
    // if (listFieldRequired.find(field => !data[field])) {
    //   return false;
    // }
    for (let key in data) {
      if (key != 'expiredDays' && key != 'level') {
        if ((typeof data[key] == 'object' && data[key].length) || (typeof data[key] != 'object' && data[key])) {
          return true;
        }
      }
    }

    return false;
  }

  saveDraft(data, type) {
    let draftData = { ...data }
    for (let key in draftData) {
      if (!draftData[key]) {
        delete draftData[key];
      }
    }
    if (this.job) {
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
}

const CURRENT_DATE = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  day: new Date().getDate()
}


const TAB_TYPE = {
  ACTIVE: '',
  CLOSE: 'expired',
  DRAFT: 'draft'
}
