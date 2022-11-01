import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HelperService } from 'src/app/services/helper.service';
import { QuestionCustomAssessment, initData, DataUpdate, Question, FullAnswers } from 'src/app/interfaces/questionCustomAssessment';
import { JobService } from 'src/app/services/job.service';
import { JobCategory } from 'src/app/interfaces/jobCategory';
import { QESTION_CUSTOME_ASSESSMENT, ASSESSMENTS_TYPE, TAB_ASSESSMENT_JOBSEEKER, ASSESSMENTS_CUSTOM_CONFIG } from 'src/app/constants/config';
import { AssessmentService } from 'src/app/services/assessment.service';
import { MESSAGE } from 'src/app/constants/message';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'ms-add-custom-assessments',
  templateUrl: './add-custom-assessments.component.html',
  styleUrls: ['./add-custom-assessments.component.scss']
})
export class AddCustomAssessmentsComponent implements OnInit {
  questionCustomAssessment: QuestionCustomAssessment = initData();
  customAssessmentInfoForm: FormGroup;
  listQuestionAssessment: QuestionCustomAssessment[] = [];
  listQuestionAssessmentBackup: QuestionCustomAssessment[] = [];
  isLoadingSave: boolean;
  dataUpdate: DataUpdate = new DataUpdate();
  isPreviewCustomAssessment: boolean;
  customAssessmentEdit: any;
  updateData: boolean = false;
  messageValidateAssessment: string;
  requireQuestion: boolean = false;
  assessmentConfig = ASSESSMENTS_CUSTOM_CONFIG;
  msgLimitQuestion = '';

  constructor(
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private jobService: JobService,
    private helperService: HelperService,
    private assessmentService: AssessmentService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.id) {
        this.getCustomAssessmentDetails(params.id);
      }
      if (params && params.isEdit) {
        this.updateData = true;
        this.isPreviewCustomAssessment = params.isEdit == 'true' ? false : true;
      }
    })
    if (!this.updateData) this.listQuestionAssessment.push(this.questionCustomAssessment);
    this.initForm();
  }

  initForm() {
    this.customAssessmentInfoForm = this.fb.group({
      name: ['', [Validators.required]],
      timeLimit: ['', [Validators.min(1), Validators.max(ASSESSMENTS_CUSTOM_CONFIG.TimeLimit)]],
      description: [''],
      instruction: ['']
    })
  }

  setData(data: DataUpdate) {
    this.customAssessmentInfoForm.controls['name'].setValue(data.name);
    this.customAssessmentInfoForm.controls['timeLimit'].setValue(data.duration);
    this.customAssessmentInfoForm.controls['description'].setValue(data.description);
    this.customAssessmentInfoForm.controls['instruction'].setValue(data.instruction);
  }

  getCustomAssessmentDetails(id) {
    this.assessmentService.getCustomAssessmentDetails(id, ASSESSMENTS_TYPE.Custom).subscribe(data => {
      this.customAssessmentEdit = data;
      this.setData(this.customAssessmentEdit);
    }, err => {
      this.helperService.showToastError(err);
    })
  }

  checkValidMarkAssessment() {
    // delete question status false
    let removesItem = [];
    this.listQuestionAssessment.forEach((assessment, index) => {
      if (!assessment.status) {
        removesItem.push(index);
        this.listQuestionAssessmentBackup.push(assessment);
      }
    })
    for (var i = removesItem.length - 1; i >= 0; i--) this.listQuestionAssessment.splice(removesItem[i], 1);

    let sumAssessmentPoint = 0;
    this.listQuestionAssessment.forEach(assessment => {
      if (assessment.weight) {
        assessment.weight = Number.parseInt(assessment.weight.toFixed(0));
        sumAssessmentPoint += assessment.weight;
      }
    })

    if (sumAssessmentPoint > 100) {
      this.messageValidateAssessment = MESSAGE.TOTAL_POINT_CUSTOM_ASSESSMENT;
      return false;
    }

    if (sumAssessmentPoint < 100 && this.listQuestionAssessment.filter(item => !item.weight).length == 0 && sumAssessmentPoint > 0) {
      this.messageValidateAssessment = MESSAGE.TOTAL_POINT_CUSTOM_ASSESSMENT;
      return false;
    }
    const markNoPoint = parseInt(parseInt(Number(((100 - Number(sumAssessmentPoint))) / (this.listQuestionAssessment.filter(item => !item.weight).length)).toString()).toFixed(0));
    this.listQuestionAssessment.forEach(assessment => {
      if (!assessment.weight) {
        assessment.weight = markNoPoint;
        sumAssessmentPoint += markNoPoint;
      }
    })
    let numberOfSurplus = 100 - sumAssessmentPoint;

    if (this.listQuestionAssessment.length) {
      for (let i = 0; i <= this.listQuestionAssessment.length; i++) {
        if (numberOfSurplus > 0) {
          this.listQuestionAssessment[i].weight = this.listQuestionAssessment[i].weight + 1;
          sumAssessmentPoint = sumAssessmentPoint + 1;
          numberOfSurplus = numberOfSurplus - 1;
        } else {
          sumAssessmentPoint = 100;
          break;
        }
      }
    }

    if (this.listQuestionAssessment.find(assessment => assessment.weight == 0)) {
      return false;
    }

    if (this.listQuestionAssessment.filter(item => !item.weight).length > 0) {
      return true;
    }
    if (this.listQuestionAssessment.find(assessment => !assessment.weight)) {
      return false;
    }
    this.messageValidateAssessment = '';
    return true;
  }

  saveCustomAssessment() {
    this.helperService.markFormGroupTouched(this.customAssessmentInfoForm);
    // check point question
    if (!this.checkValidMarkAssessment() || this.customAssessmentInfoForm.invalid) {
      this.requireQuestion = true;
      return;
    }
    this.dataUpdate = new DataUpdate();
    const customAssessmentId = this.updateData ? this.customAssessmentEdit.id : null;
    this.dataUpdate.name = this.customAssessmentInfoForm.value.name;
    this.dataUpdate.duration = this.customAssessmentInfoForm.value.timeLimit || null;
    this.dataUpdate.description = this.customAssessmentInfoForm.value.description;
    this.dataUpdate.instruction = this.customAssessmentInfoForm.value.instruction;
    this.dataUpdate.questions = this.listQuestionAssessment.length;

    // add list question
    this.listQuestionAssessment.push(...this.listQuestionAssessmentBackup);
    this.listQuestionAssessment.map((question) => {
      let questionItem: Question = new Question();
      questionItem.weight = question.weight;
      questionItem.title = question.question;
      if (this.updateData) {
        if (question.id) questionItem.id = question.id;
        if (question.action) questionItem.action = question.action;
        if (question.assessment_custom_id) questionItem.assessment_custom_id = question.assessment_custom_id;
      }
      questionItem.type = Number.parseInt(question.type.toString());
      questionItem.title_image = question.image && question.image != '' ? question.image : null;
      switch (Number.parseInt(question.type.toString())) {
        case QESTION_CUSTOME_ASSESSMENT.CHECKBOXES || QESTION_CUSTOME_ASSESSMENT.MULTIPLE_CHOICE:
          question.listAnswerOptionCheckboxes.map((item, index) => {
            questionItem.full_answers.push(this.getDataAnswer(item, index));
          })
          questionItem.is_any_correct = question.is_any_correct ? 1 : 0;
          break;
        case QESTION_CUSTOME_ASSESSMENT.TRUE_FALSE:
          question.listAnswerOptionMultiChioce.map((item, index) => {
            questionItem.full_answers.push(this.getDataAnswer(item, index));
          })
          break;
        case QESTION_CUSTOME_ASSESSMENT.SINGLE_TEXTBOX:
          let answer: FullAnswers = new FullAnswers();
          answer.id = 0;
          answer.answer = question.answer;
          answer.is_true = 1;
          questionItem.full_answers.push(answer);
          question.listAnswerAlternative.map((item, index) => {
            questionItem.full_answers.push(this.getDataAnswer(item, index + 1));
          })
          break;
      }
      this.dataUpdate.questionList.push(questionItem);
    })

    // check require answer
    if (this.isCheckRequireQuestion(this.dataUpdate)) {
      this.dataUpdate = this.assessmentService.convertStringifyData(this.dataUpdate);
      if (this.updateData) {
        this.updateDataAeeseement(this.dataUpdate, customAssessmentId);
      } else {
        this.createDataAeeseement(this.dataUpdate);
      }
    } else {
      this.requireQuestion = true;
      return;
    }

  }

  isCheckRequireQuestion(dataUpdate: DataUpdate) {
    let result = true;
    let data = Object.assign([], dataUpdate.questionList);
    data.map(question => {
      if (question.title == '') result = false;
      switch (Number.parseInt(question.type.toString())) {
        case QESTION_CUSTOME_ASSESSMENT.CHECKBOXES || QESTION_CUSTOME_ASSESSMENT.MULTIPLE_CHOICE:
          if (question.full_answers.length <= 0) {
            result = false;
            return;
          }
          let countCheckboxCorrectAnswer = 0;
          question.full_answers.map((answer: FullAnswers) => {
            if (answer.is_true == 1) countCheckboxCorrectAnswer += 1;
            if (answer.answer == '' || !answer.answer) result = false;
          })
          if (countCheckboxCorrectAnswer == 0) result = false;
          break;
        case QESTION_CUSTOME_ASSESSMENT.TRUE_FALSE:
          if (question.full_answers.length <= 0) {
            result = false;
            return;
          }
          let countMultiCorrectAnswer = 0;
          question.full_answers.map((answer: FullAnswers) => {
            if (answer.is_true == 1) countMultiCorrectAnswer += 1;
            if (answer.answer == '' || !answer.answer) result = false;
          })
          if (countMultiCorrectAnswer == 0) result = false;
          break;
        case QESTION_CUSTOME_ASSESSMENT.SINGLE_TEXTBOX:
          if (question.full_answers[0].answer == '' || !question.full_answers[0].answer) result = false;
          break;
      }
    });
    return result;
  }

  createDataAeeseement(dataUpdate) {
    this.isLoadingSave = true;
    this.assessmentService.createCustomAssessment(dataUpdate).subscribe(data => {
      this.isLoadingSave = false;
      this.goToCustomAssessment();
      this.helperService.showToastSuccess(MESSAGE.CREATE_CUSTOM_AEESEEMENT_SUCCESSFULY);
    }, err => {
      this.isLoadingSave = false;
      this.goToCustomAssessment();
      this.helperService.showToastError(err);
    })
  }

  updateDataAeeseement(dataUpdate, id) {
    this.isLoadingSave = true;
    this.assessmentService.updateCustomAssessment(dataUpdate, id).subscribe(data => {
      this.isLoadingSave = false;
      this.goToCustomAssessment();
      this.helperService.showToastSuccess(MESSAGE.CREATE_CUSTOM_AEESEEMENT_SUCCESSFULY);
    }, err => {
      this.isLoadingSave = false;
      this.goToCustomAssessment();
      this.helperService.showToastError(err);
    })
  }

  getDataAnswer(data, index): FullAnswers {
    let answer: FullAnswers = new FullAnswers();
    answer.id = index;
    answer.answer = data.answerName;
    answer.is_true = data.status ? 1 : 0;
    return answer;
  }

  goToCustomAssessment() {
    // this.router.navigate(['/employer-assessments'], { queryParams: { custom: TAB_ASSESSMENT_JOBSEEKER.custom } });
    this.location.back();
  }
  setLimitQuestion(msg: string) {
    this.msgLimitQuestion = msg;
  }
}
