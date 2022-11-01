import { Component, Input, OnInit } from '@angular/core';
import { ASSESSMENTS_CUSTOM_CONFIG, QESTION_CUSTOME_ASSESSMENT } from 'src/app/constants/config';
import { DataUpdate } from 'src/app/interfaces/questionCustomAssessment';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ms-take-custome-assessment-question',
  templateUrl: './take-custome-assessment-question.component.html',
  styleUrls: ['./take-custome-assessment-question.component.scss']
})
export class TakeCustomeAssessmentQuestionComponent implements OnInit {
  @Input() customAssessment: DataUpdate;
  questionType = QESTION_CUSTOME_ASSESSMENT;
  labeledOrderAnswer = ASSESSMENTS_CUSTOM_CONFIG.LabelOrderAnswer;
  constructor() { }

  ngOnInit(): void {
    this.customAssessment.questionList.map(data => {
      if (data.answers) data.answers = JSON.parse(data.answers);
      if (data.type == this.questionType.CHECKBOXES && data.is_any_correct == 1) data.type = this.questionType.TRUE_FALSE;
    });
  }

  getImageQuerstion(title) {
    return `${title}`
  }

  checkedAnswerOption(index, ques, isMultiChoice) {
    if (isMultiChoice) {
      ques.answers[index].status = true;
      for (let i = 0; i < ques.answers.length; i++) {
        if (i == index) continue;
        ques.answers[i].status = false;
      }
    } else {
      ques.answers[index].status = true;
    }
  }
}
