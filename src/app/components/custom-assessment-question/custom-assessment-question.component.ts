import { get } from 'lodash';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TYPE_QESTION_CUSTOME_ASSESSMENT, QESTION_CUSTOME_ASSESSMENT, ASSESSMENTS_CUSTOM_QUESTION_ACTION, ASSESSMENTS_CUSTOM_CONFIG, MAX_SIZE_IMAGE_UPLOAD, UPLOAD_TYPE } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { QuestionCustomAssessment, initData, DataUpdate, Question, FullAnswers } from 'src/app/interfaces/questionCustomAssessment';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment'

@Component({
  selector: 'ms-custom-assessment-question',
  templateUrl: './custom-assessment-question.component.html',
  styleUrls: ['./custom-assessment-question.component.scss']
})
export class CustomAssessmentQuestionComponent implements OnInit {
  @Input() questionAssessments: QuestionCustomAssessment[];
  @Input() requireQuestion: boolean;
  @Input() isPreviewCustomAssessment: boolean;
  @Input() customAssessmentEdit: DataUpdate;
  @Output() limitQuestion = new EventEmitter<string>();
  listTypeQuestion = TYPE_QESTION_CUSTOME_ASSESSMENT;
  questionCustomAssessment: QuestionCustomAssessment;
  listQuestionCustomAssessment = QESTION_CUSTOME_ASSESSMENT;
  actions = ASSESSMENTS_CUSTOM_QUESTION_ACTION;
  isUpdateData: boolean = false;
  messageWeightValidate = MESSAGE.POINT_EXIST_ZERO_CUSTOM_ASSESSMENT;
  labeledOrderAnswer = ASSESSMENTS_CUSTOM_CONFIG.LabelOrderAnswer;
  maxNbrQuestion = ASSESSMENTS_CUSTOM_CONFIG.MaxNbrQuestion;
  msgLimitQuestion = ASSESSMENTS_CUSTOM_CONFIG.MsgLimitQuestion;
  isMaxSizeImage: boolean = false;
  isUploading: boolean;
  MAXIMUM_UPLOAD_FILE: string = MESSAGE.MAXIMUM_UPLOAD_FILE;

  constructor(
    private helperService: HelperService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    if (this.customAssessmentEdit) {
      this.isUpdateData = true;
      this.bindingData(this.customAssessmentEdit);
    }
  }

  bindingData(customAssessmentEdit: DataUpdate) {
    customAssessmentEdit.questionList.map((data, index) => {
      const customAssessment: QuestionCustomAssessment = initData();
      const fullAnswers = JSON.parse(data.full_answers);
      const answers = this.bindDataAnswer(fullAnswers);
      customAssessmentEdit.questionList[index].type = data.type == QESTION_CUSTOME_ASSESSMENT.MULTIPLE_CHOICE ? QESTION_CUSTOME_ASSESSMENT.CHECKBOXES : data.type;
      customAssessment.type = data.type == QESTION_CUSTOME_ASSESSMENT.MULTIPLE_CHOICE ? QESTION_CUSTOME_ASSESSMENT.CHECKBOXES : data.type;
      customAssessment.question = data.title;
      customAssessment.weight = data.weight;
      customAssessment.image = data.title_image ? data.title_image : null;
      if (customAssessment.type == QESTION_CUSTOME_ASSESSMENT.CHECKBOXES) customAssessment.is_any_correct = data.is_any_correct ? data.is_any_correct == 1 : false;
      switch (data.type) {
        case this.listQuestionCustomAssessment.TRUE_FALSE:
          customAssessment.listAnswerOptionMultiChioce = answers;
          break;
        case this.listQuestionCustomAssessment.CHECKBOXES:
          customAssessment.listAnswerOptionCheckboxes = answers;
          break;
        case this.listQuestionCustomAssessment.SINGLE_TEXTBOX:
          customAssessment.answer = answers[0].answerName;
          answers.splice(0, 1);
          customAssessment.listAnswerAlternative = answers;
          break;
      }
      this.questionAssessments.push(
        Object.assign({}, customAssessment,
          { id: data.id },
          { assessment_custom_id: data.assessment_custom_id },
          { action: this.actions.Update })
      );
    })
  }

  bindDataAnswer(data: FullAnswers[]) {
    let results = [];
    data.map(aw => {
      results.push({
        answerName: aw.answer,
        status: aw.is_true == 1 ? true : false
      })
    })
    return results;
  }

  removeQuestion(ques) {
    let index = this.questionAssessments.findIndex(question => question === ques);
    if (this.isUpdateData && ques.id) {
      this.questionAssessments[index].action = this.actions.Remove;
      this.questionAssessments[index].weight = 0;
      this.questionAssessments[index].status = false;
    } else {
      this.questionAssessments.splice(index, 1);
    }
    this.emitMessageQuestion();
  }
  addQuestion() {
    const nbrQuestion = get(this.questionAssessments, 'length', 0);
    if (nbrQuestion >= ASSESSMENTS_CUSTOM_CONFIG.MaxNbrQuestion) {
      // show error
      //console.log("show error");
      this.helperService.showToastError(this.msgLimitQuestion);
      return;
    }
    this.questionCustomAssessment = initData();
    if (this.isUpdateData) {
      this.questionAssessments.push(
        Object.assign({}, this.questionCustomAssessment,
          { action: this.actions.Add },
          { assessment_custom_id: this.customAssessmentEdit.id },
        )
      );
    } else {
      this.questionCustomAssessment.id = this.questionAssessments.length;
      this.questionAssessments.push(this.questionCustomAssessment);
    }
    this.emitMessageQuestion();
    // //console.log(this.questionAssessments);
  }
  emitMessageQuestion() {
    const nbrQuestion = get(this.questionAssessments, 'length', 0);
    const msg = nbrQuestion == ASSESSMENTS_CUSTOM_CONFIG.MaxNbrQuestion ? ASSESSMENTS_CUSTOM_CONFIG.MsgLimitQuestion : '';
    this.limitQuestion.emit(msg);
  }
  // clear data answer other
  changeSelectTypeQuestion(event, ques) {
    const dataQuestionCheckboxs = [
      { answerName: '', status: false },
      { answerName: '', status: false },
      { answerName: '', status: false },
      { answerName: '', status: false }
    ];
    let type: number = Number.parseInt(event.target.value);
    switch (type) {
      case this.listQuestionCustomAssessment.TRUE_FALSE:
        ques.listAnswerAlternative = [];
        ques.listAnswerOptionCheckboxes = dataQuestionCheckboxs;
        ques.answer = '';
        break;
      case this.listQuestionCustomAssessment.CHECKBOXES:
        ques.listAnswerAlternative = [];
        ques.answer = '';
        break;
      case this.listQuestionCustomAssessment.SINGLE_TEXTBOX:
        ques.listAnswerOptionCheckboxes = dataQuestionCheckboxs;
        break;
    }
  }

  deleteAnswerOption(answer, ques) {
    let index = ques.listAnswerOptionCheckboxes.findIndex(ans => ans === answer);
    ques.listAnswerOptionCheckboxes.splice(index, 1);
  }

  checkedAnswerOption(index, ques, trueFalseQuestion = false) {
    if (trueFalseQuestion) {
      if (ques.listAnswerOptionMultiChioce[index].status) {
        ques.listAnswerOptionMultiChioce[index].status = false;
      } else {
        ques.listAnswerOptionMultiChioce[index].status = true;
        ques.listAnswerOptionMultiChioce.map((data, i) => {
          if (i == index) return;
          ques.listAnswerOptionMultiChioce[i].status = false;
        })
      }
    } else {
      if (ques.listAnswerOptionCheckboxes[index].status) {
        ques.listAnswerOptionCheckboxes[index].status = false;
      } else {
        ques.listAnswerOptionCheckboxes[index].status = true;
      }
    }
  }

  addAnswerOptions(type, question: QuestionCustomAssessment) {
    let option = {
      answerName: '',
      status: false
    }
    let nbrAnswer;
    switch (type) {
      case this.listQuestionCustomAssessment.CHECKBOXES:
        nbrAnswer = get(question, 'listAnswerOptionCheckboxes.length', 0);
        if (nbrAnswer >= 5) { return; }
        question.listAnswerOptionCheckboxes.push(option);
        return;
      // case this.listQuestionCustomAssessment.MULTIPLE_CHOICE:
      //   nbrAnswer = get(question, 'listAnswerOptionMultiChioce.length', 0);
      //   if (nbrAnswer >= 5) { return; }
      //   question.listAnswerOptionMultiChioce.push(option);
      //   return;
      case this.listQuestionCustomAssessment.SINGLE_TEXTBOX:
        nbrAnswer = get(question, 'listAnswerAlternative.length', 0);
        if (nbrAnswer >= 5) { return; }
        question.listAnswerAlternative.push(Object.assign({}, option, { status: true }))
        return;
    }
  }

  checkCorectAnswer(listAnswer) {
    let count = 0;
    listAnswer.map(ans => {
      if (ans.status) count++;
    })
    return count == 0;
  }


  async deleteImageQuestion(ques: QuestionCustomAssessment, number) {
    const isConfirmed = await this.helperService.confirmPopup(MESSAGE.CONFIRM_DELETE_EMPLOYER_PHOTO, 'Yes');
    if (isConfirmed) {
      const data = { path: ques.image};
      this.userService.deleteEmployerPhoto(data).subscribe(res => {
        const id = `imageUpload-${number}`
        const imageUploadEl: any = document.getElementById(id);
        imageUploadEl.value = '';
        const index = this.questionAssessments.findIndex(question => question.id == ques.id);
        this.questionAssessments[index].image = "";
      }, errorRes => {
        this.helperService.showToastError(errorRes);
      })
    }
  }


  handleUpload(event, ques: QuestionCustomAssessment, number) {
    const maxSize = MAX_SIZE_IMAGE_UPLOAD;
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.isMaxSizeImage = false;
      if (file.size > maxSize) {
        this.isMaxSizeImage = true;
        const id = `imageUpload-${number}`
        const imageUploadEl: any = document.getElementById(id);
        imageUploadEl.value = '';
        const index = this.questionAssessments.findIndex(question => question.id == ques.id);
        this.questionAssessments[index].image = "";
        return;
      }
      this.setFileUploadHandle(file, event, ques);
    } else {
    }
  }

  setFileUploadHandle(file, event, ques: QuestionCustomAssessment) {
    if (file) {
      this.isUploading = true;
      const fileName = file.name;
      const formData: FormData = new FormData();
      formData.append('file', file);
      formData.append('uploadType', UPLOAD_TYPE.QuesionImage);
      this.userService.uploadImage(formData).subscribe((res: any) => {
        this.isUploading = false;
        const imageQuestion = res.url;
        const index = this.questionAssessments.findIndex(question => question.id == ques.id);
        this.questionAssessments[index].image = imageQuestion;
      }, (errorRes) => {
        this.isUploading = false;
        this.helperService.showToastError(errorRes);
      }
      );
    }
  }

}
