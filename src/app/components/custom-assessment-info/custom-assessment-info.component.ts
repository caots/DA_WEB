import {ASSESSMENTS_CUSTOM_CONFIG, CUSTOM_ASSESSMENT_INTRUCTION_TEXT} from './../../constants/config';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { JobCategory } from 'src/app/interfaces/jobCategory';

@Component({
  selector: 'ms-custom-assessment-info',
  templateUrl: './custom-assessment-info.component.html',
  styleUrls: ['./custom-assessment-info.component.scss']
})
export class CustomAssessmentInfoComponent implements OnInit {
  @Input() formUpdate: FormGroup;
  @Input() isPreviewCustomAssessment: boolean;
  @Input() listCategory: JobCategory[];
  TimeLimit = ASSESSMENTS_CUSTOM_CONFIG.TimeLimit;
  textIntruction = CUSTOM_ASSESSMENT_INTRUCTION_TEXT.TEXT;
  constructor(
  ) { }

  ngOnInit(): void {    
  }

}
