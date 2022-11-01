import { Component, OnInit, Output, EventEmitter, Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbDate, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { LIST_QUESTION_SURVEY } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { HelperService } from 'src/app/services/helper.service';
import { SubjectService } from 'src/app/services/subject.service';
import { UserService } from 'src/app/services/user.service';
import * as moment from 'moment';

@Injectable()
export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct | null {
    if (value) {
      const dateParts = value.trim().split('/');

      let dateObj: NgbDateStruct = { month: <any>null, day: <any>null, year: <any>null }
      const dateLabels = Object.keys(dateObj);
      
      dateParts.forEach((datePart, idx) => {
        dateObj[dateLabels[idx]] = parseInt(datePart, 10) || <any>null;
      });
      return dateObj;
    }
    return null;
  }

  static formatDate(date: NgbDateStruct | NgbDate | null): string {
    return date ?
      `${HelperService.padNumber(date.month)}/${HelperService.padNumber(date.day)}/${date.year || ''}` :
      '';
  }

  format(date: NgbDateStruct | null): string {
    return NgbDateCustomParserFormatter.formatDate(date);
  }
}
@Component({
  selector: 'ms-pf-demographic-survey',
  templateUrl: './pf-demographic-survey.component.html',
  styleUrls: ['./pf-demographic-survey.component.scss']
})

export class PfDemographicSurveyComponent implements OnInit {
  isCallingApi: boolean = false;
  isLoadingDataSurvey: boolean = false;
  formSurvey: FormGroup;
  listQuestionSurveys = LIST_QUESTION_SURVEY;
  placeHolderExpired: NgbDateStruct;
  userSurvey: any;
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'title',
    itemsShowLimit: 3,
  };
  isSubmitted: boolean = false;
  checkTypeDate: boolean = true;
  YES_ANSWER_VeteranStatus = 1;
  CURRENT_YEAR = new Date().getFullYear();
  CURRENT_MONTH = new Date().getMonth();
  CURRENT_DATE = new Date().getDate();
  constructor(
    private fb: FormBuilder,
    public formatter: NgbDateParserFormatter,
    private subjectService: SubjectService,
    private helperService: HelperService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getUserSurvey();
  }

  getUserSurvey() {
    this.isLoadingDataSurvey = true;
    this.userService.getUserSurvey().subscribe(data => {
      this.userSurvey = data;
      if (typeof this.userSurvey.answers == 'string') this.userSurvey.answers = JSON.parse(this.userSurvey.answers);
      this.bindingAnswer();
    }, err => {
      this.isLoadingDataSurvey = false;
      return;
    })
  }

  bindingAnswer() {
    const answers = this.userSurvey.answers;
    if(answers.question1 != '') this.formSurvey.get('question1').setValue(answers.question1);
    if(answers.question2 != '') this.formSurvey.get('question2').setValue(answers.question2);
    if(answers.question3 != '') this.formSurvey.get('question3').setValue(answers.question3);
    if(answers.question4 != '') this.formSurvey.get('question4').setValue(answers.question4);
    if(answers.question5 != '') this.formSurvey.get('question5').setValue(answers.question5);
    if(answers.question6 != '') this.formSurvey.get('question6').setValue(answers.question6);
    if(answers.question7 != '') this.formSurvey.get('question7').setValue(answers.question7);
    this.isLoadingDataSurvey = false;
  }

  initForm() {
    this.formSurvey = this.fb.group({
      question1: [''],
      question2: [''],
      question3: [''],
      question4: [''],
      question5: [''],
      question6: [''],
      question7: [''],
    })
  }

  convertNbDateToDate(nbDate) {
    let date = `${nbDate.year}/${nbDate.month}/${nbDate.day}`;
    let result = new Date(date.toString());
    return result;
  }

  save(form) {
    this.isCallingApi = true;
    this.isSubmitted = true;
    if (form.question1) {
      if (
        !Object.keys(form.question1).includes('year') ||
        !Object.keys(form.question1).includes('month') ||
        !Object.keys(form.question1).includes('day')
      ) {
        this.checkTypeDate = false;
        this.isCallingApi = false;

        return;
      } else {
        const dateInput = this.convertNbDateToDate(form.question1);
        if (!moment(dateInput).isSameOrBefore(`${this.CURRENT_YEAR}-${this.CURRENT_MONTH}-${this.CURRENT_DATE}`) ||
          !moment(dateInput).isSameOrAfter(`${this.CURRENT_YEAR - 100}-${this.CURRENT_MONTH}-${this.CURRENT_DATE}`)
        ) {
          this.checkTypeDate = false;
          this.isCallingApi = false;
          return;
        }
        this.checkTypeDate = true;
      }
    }

    let data = {
      question1: form.question1 || '',
      question2: form.question2 || '',
      question3: form.question3 || '',
      question4: form.question4 || '',
      question6: form.question6 || '',
      question7: form.question7 || '',
      question5: ''
    }

    if (form.question4 == this.YES_ANSWER_VeteranStatus) {
      data = { ...data, question5: form.question5 };
    }

    if (!this.userSurvey) {
      const body = { answers: JSON.stringify(data) };
      this.createSurveyUSer(body);
      return;
    }
    const userSurvey = { ...this.userSurvey, answers: JSON.stringify(data) };
    delete userSurvey.id;
    delete userSurvey.created_at;
    delete userSurvey.updated_at;
    const body = {
      id: this.userSurvey?.id,
      userSurvey: userSurvey
    }
    this.userService.updateUserSurvey(body).subscribe(res => {
      this.isCallingApi = false;
      this.isSubmitted = false;
      this.helperService.showToastSuccess(MESSAGE.UPDATE_USER_SURVEY_SUCCESS);
      this.userService.getUserSurvey().subscribe();
    }, errorRes => {
      this.isCallingApi = false;
      this.isSubmitted = false;
      this.helperService.showToastError(errorRes);
    })
  }

  createSurveyUSer(body) {
    this.userService.createUserSurvey(body).subscribe(res => {
      this.isCallingApi = false;
      this.isSubmitted = false;
      this.helperService.showToastSuccess(MESSAGE.UPDATE_USER_SURVEY_SUCCESS);
      this.userService.getUserSurvey().subscribe();
    }, errorRes => {
      this.isCallingApi = false;
      this.isSubmitted = false;
      this.helperService.showToastError(errorRes);
    })
  }

}
