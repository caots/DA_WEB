import { Component, Input, OnInit } from '@angular/core';
import { CUSTOM_ASSESSMENT_INTRUCTION_TEXT } from 'src/app/constants/config';
import { DataUpdate } from 'src/app/interfaces/questionCustomAssessment';

@Component({
  selector: 'ms-take-custome-assessment-info',
  templateUrl: './take-custome-assessment-info.component.html',
  styleUrls: ['./take-custome-assessment-info.component.scss']
})
export class TakeCustomeAssessmentInfoComponent implements OnInit {
  @Input() customAssessment: DataUpdate;
  textIntruction = CUSTOM_ASSESSMENT_INTRUCTION_TEXT.TEXT;

  constructor() { }

  ngOnInit(): void {   
  }

}
