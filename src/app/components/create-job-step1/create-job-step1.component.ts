import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Assesment } from 'src/app/interfaces/assesment';
import { JobCategory } from 'src/app/interfaces/jobCategory';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MESSAGE } from 'src/app/constants/message';
import { FormGroup } from '@angular/forms';
import { STEP_CREATE_JOB, ASSESSMENTS_TYPE, EMPLOYMENT_TYPE, MAX_ASSESSMENT_IMOCHA } from 'src/app/constants/config';
import { HelperService } from 'src/app/services/helper.service';
import { Job } from 'src/app/interfaces/job';
import { uniqBy } from 'lodash';
import { AssessmentService } from 'src/app/services/assessment.service';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'ms-create-job-step1',
  templateUrl: './create-job-step1.component.html',
  styleUrls: ['./create-job-step1.component.scss']
})
export class CreateJobStep1Component implements OnInit {
  @Input() job: Job;
  @Input() activeTab: string;
  @Input() tabType: any;
  @Input() editModalJob: boolean;
  @Input() isPriveJob: boolean;
  @Input() isSaveDraft: boolean;
  @Input() listCategory: Array<JobCategory> = [];
  @Input() listAssessment: Array<Assesment> = [];
  @Input() listSelectedAssessmentRef: Array<Assesment> = [];
  @Input() formAddNewJob: FormGroup;
  @Input() listSelectedAssesment: Array<Assesment> = [];
  @Output() continuteStep = new EventEmitter();
  @Output() submitDraft = new EventEmitter();
  @Output() changeStatus = new EventEmitter();
  @Output() backStep = new EventEmitter();
  @Output() submit = new EventEmitter();
  @Input() isAddingJob: boolean;
  @Input() isSubmited: boolean;

  checkLengthSuggestAssessment: boolean = false;
  modalAddAssessmentTagRef: NgbModalRef;
  modalEditAssessmentTagRef: NgbModalRef;
  editingAssessment: Assesment;
  messageValidateAssessment: string;
  employemntTypes = EMPLOYMENT_TYPE;
  disbaleSuggestAssessment: boolean = false;
  assessmentTypeImocha = ASSESSMENTS_TYPE.IMocha;
  isCheckTitleSaveDraft: boolean = false;
  isShowErrorStep1: boolean = false;
  isSaveEditJob: boolean = false;
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      [{ 'header': 1 }, { 'header': 2 }], // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
      [{ 'direction': 'rtl' }], // text direction
      [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'], // remove formatting button
      ['link'], // link and image, video
    ]
  };

  constructor(
    private subjectService: SubjectService,
    private modalService: NgbModal,
    private helperService: HelperService,
    private assessmentService: AssessmentService
  ) { }

  ngOnInit(): void {
    this.bindingCreateData();
    // check swicth step in header
    this.subjectService.switchStepCreateJob.subscribe(data => {
      if(!data) return;
      if(STEP_CREATE_JOB.STEP_1 < data.next){
        this.helperService.markFormGroupTouched(this.formAddNewJob);
        this.bindingCreateData();
        this.formAddNewJob.get('listAssessment').setValue(this.listSelectedAssesment);
        if(this.checkSwicthStep()) {
          console.log('false step 2');
          this.subjectService.isAllowNextStepCreateJob.next(false);
        }
      }
    });
  }

  bindingCreateData(){
    if (this.job) {
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
      if (this.listSelectedAssessmentRef && this.listSelectedAssessmentRef.length > 0) {
        this.listSelectedAssessmentRef.map(ass => {
          listSelectedAssesment.push({ ...ass, point: 0 })
        })
        let newListAssesment = this.uniqueAsessment(listSelectedAssesment);
        listSelectedAssesment = [];
        newListAssesment.map(data => {
          listSelectedAssesment.push(Object.assign({}, data, { point: 0 }));
        })
      }
      // this.formAddNewJob.get('listAssessment').setValue(listSelectedAssesment);
      this.listSelectedAssesment = listSelectedAssesment;
    }else{
      this.listSelectedAssesment = this.listSelectedAssessmentRef && this.listSelectedAssessmentRef;
    }
    if (!this.formAddNewJob.get('category').value) this.formAddNewJob.get('category').setValue('0');
    if (this.formAddNewJob.get('listAssessment').value) this.listSelectedAssesment = this.formAddNewJob.get('listAssessment').value;
    if (this.formAddNewJob.get('employment_type').value == "" || !this.formAddNewJob.get('employment_type').value)
      this.formAddNewJob.get('employment_type').setValue(EMPLOYMENT_TYPE[0].id);

    this.listSelectedAssesment.map(data => {
      const index = this.listAssessment.findIndex(ass => ass.id == data.id);
      if (index >= 0) this.listAssessment[index].selectJobStatus = true;
    });
  }
  

  checkSwicthStep(){
    this.helperService.markFormGroupTouched(this.formAddNewJob);
    if (!this.checkValidMarkAssessment()) return true;
    if (this.formAddNewJob.get('category').value == '' || this.formAddNewJob.get('category').value == null) return true;
    if (this.formAddNewJob.get('description').value == '' || this.formAddNewJob.get('description').value == null) return true;
    if (this.listSelectedAssesment.length <= 0)  return true;
    return false;
  }

  selectAssessmentJob(assessment: Assesment) {
    const indexRoot = this.listAssessment.findIndex(ass => ass.id == assessment.id);
    if (indexRoot >= 0) this.listAssessment[indexRoot].selectJobStatus = !this.listAssessment[indexRoot].selectJobStatus;
    const index = this.listSelectedAssesment.findIndex(ass => ass.id == assessment.id);
    if (assessment.selectJobStatus) {
      if (index >= 0) return;
      this.addAssessment(assessment);
    } else {
      if (index >= 0) this.removeAssessment(assessment);
    }
  }

  uniqueAsessment(arrJobAssessment) {
    // var newArr = []
    const newArr = uniqBy(arrJobAssessment, 'assessmentId');
    // arrJobAssessment.filter(assessment => {
    //   let index = newArr.findIndex(arr => arr.assessmentId === assessment.assessmentId);
    //   if (index < 0) {
    //     newArr.push(assessment);
    //   }
    // })
    // return newArr
    return newArr
  }

  checkValidMarkAssessment() {
    let sumAssessmentPoint = 0;
    this.listSelectedAssesment.forEach(assessent => {
      if (assessent.point) {
        sumAssessmentPoint += assessent.point;
      }
    })
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

  checkRequireValue(form) {
    if (form.category == '' || form.category == null) return true;
    if (form.description == '' || form.description == null) return true;
    return false;
  }

  continuteStep1(form) {
    this.subjectService.isAllowNextStepCreateJob.next(true);
    this.isShowErrorStep1 = true;
    this.helperService.markFormGroupTouched(this.formAddNewJob);
    if (!this.checkValidMarkAssessment() || this.checkRequireValue(form)) {
      return;
    }
    if (this.listSelectedAssesment.length <= 0) {
      this.messageValidateAssessment = MESSAGE.ASSESSMENT_REQUIRED;
      return;
    }
    this.formAddNewJob.get('listAssessment').setValue(this.listSelectedAssesment);
    this.continuteStep.emit({step: STEP_CREATE_JOB.STEP_1, next: null});
  }

  showEditAssessment(assesment, modalEditAssessmentTag) {
    this.editingAssessment = assesment;
    this.modalEditAssessmentTagRef = this.modalService.open(modalEditAssessmentTag, {
      windowClass: 'modal-edit-assessment-tag'
    })
  }

  deleteAssessment(assesment) {
    const indexRoot = this.listAssessment.findIndex(ass => ass.id == assesment.id);
    if (indexRoot >= 0) this.listAssessment[indexRoot].selectJobStatus = false;
    this.listSelectedAssesment = this.listSelectedAssesment.filter(item => item.id != assesment.id);
    this.disbaleSuggestAssessment = false;
    this.formAddNewJob.get('listAssessment').setValue(this.listSelectedAssesment);
  }

  removeAssessment(assessment) {
    const indexRoot = this.listAssessment.findIndex(ass => ass.id == assessment.id);
    if (indexRoot) this.listAssessment[indexRoot].selectJobStatus = false;
    this.listSelectedAssesment = this.listSelectedAssesment.filter(item => {
      return item.id != assessment.id;
    })
    this.disbaleSuggestAssessment = false;
    this.formAddNewJob.get('listAssessment').setValue(this.listSelectedAssesment);
  }

  updateAssessment(assessment) {
    this.listSelectedAssesment.forEach(item => {
      if (item.id == assessment.id) {
        item.name = assessment.name;
        item.point = parseInt(assessment.point);
      }
    })
    this.modalEditAssessmentTagRef.close();
    this.formAddNewJob.get('listAssessment').setValue(this.listSelectedAssesment);
  }

  addNewAssessment(modalAddAssessment) {
    this.modalAddAssessmentTagRef = this.modalService.open(modalAddAssessment, {
      windowClass: 'modal-add-new-assessment',
      size: 'lg'
    })
  }

  addAssessment(assessment) {
    let numberAssessmentImocha = 0;
    this.listSelectedAssesment.map((ass: Assesment) => {
      if (ass.type == ASSESSMENTS_TYPE.IMocha) numberAssessmentImocha += 1;
    })
    if (numberAssessmentImocha >= MAX_ASSESSMENT_IMOCHA && assessment.type == ASSESSMENTS_TYPE.IMocha) {
      const indexRoot = this.listAssessment.findIndex(ass => ass.id == assessment.id);
      if (indexRoot >= 0) this.listAssessment[indexRoot].selectJobStatus = false;
      this.disbaleSuggestAssessment = true;
      const id = `select-assessment-${this.listAssessment[indexRoot].id}`
      const selectEndAssessment: any = document.getElementById(id);
      selectEndAssessment.checked = false;
      return;
    }
    const indexRoot = this.listAssessment.findIndex(ass => ass.id == assessment.id);
    if (indexRoot >= 0) this.listAssessment[indexRoot].selectJobStatus = true;
    if (!this.listSelectedAssesment.find(item => item.id == assessment.id)) {
      this.listSelectedAssesment.push({
        ...assessment,
      })
    }
    this.formAddNewJob.get('listAssessment').setValue(this.listSelectedAssesment);
  }

  addSaveDraft() {
    this.isCheckTitleSaveDraft = false;
    this.isShowErrorStep1 = true;
    this.checkValidMarkAssessment();
    this.formAddNewJob.get('listAssessment').setValue(this.listSelectedAssesment);
    this.submitDraft.emit();
  }

  onCheckLengthSuggestAssessment(listAssessment, category) {
    this.checkLengthSuggestAssessment = this.assessmentService.onCheckLengthSuggestAssessment(listAssessment, category);
  }

  backToStep() {
    this.backStep.emit();
  }

  saveEditJobActive(){
    this.isSubmited = true;
    this.submit.emit(this.isSubmited);
  }

  filterCategoryAssessments(category){
    const results = this.listAssessment.filter(assessment => assessment.categories.some(item => item.category_id == category));
    return results;
  }
}
