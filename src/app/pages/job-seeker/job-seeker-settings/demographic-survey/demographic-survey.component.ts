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
  selector: 'ms-demographic-survey',
  templateUrl: './demographic-survey.component.html',
  styleUrls: ['./demographic-survey.component.scss']
})
export class DemographicSurveyComponent implements OnInit {
  @Output() next = new EventEmitter();
  @Output() back = new EventEmitter();
  isCallingApi: boolean = false;
  formSurvey: FormGroup;
  listQuestionSurveys = LIST_QUESTION_SURVEY;
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'title',
    itemsShowLimit: 2,
  };
  isSubmitted: boolean = false;
  checkTypeDate: boolean = true;
  YES_ANSWER_VeteranStatus = 1;
  CURRENT_YEAR = new Date().getFullYear();
  CURRENT_MONTH = new Date().getMonth();
  CURRENT_DATE = new Date().getDate();

  constructor(
    private fb: FormBuilder,
    private subjectService: SubjectService,
    private helperService: HelperService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.initForm();
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
      question5: '',
      question6: form.question6 || '',
      question7: form.question7 || ''
    }
    if (form.question4 == this.YES_ANSWER_VeteranStatus) {
      data = { ...data, question5: form.question5 };
    }
    const body = { answers: JSON.stringify(data) };
    this.userService.createUserSurvey(body).subscribe(res => {
      this.isCallingApi = false;
      this.isSubmitted = false;
      this.helperService.showToastSuccess(MESSAGE.CREATE_ACCOUNT_JOBSEEKER_SUCCESSFULY);
      this.next.emit();
    }, errorRes => {
      this.isCallingApi = false;
      this.isSubmitted = false;
      this.helperService.showToastError(errorRes);
    })

  }

  onBack() {
    this.back.emit();
  }

}
