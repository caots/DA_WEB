import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Assesment } from 'src/app/interfaces/assesment';
import { AssessmentService } from 'src/app/services/assessment.service';
import { HelperService } from 'src/app/services/helper.service';
import { ASSESSMENTS_TYPE } from 'src/app/constants/config';
import { Router } from '@angular/router';
@Component({
  selector: 'ms-assessment-item',
  templateUrl: './assessment-item.component.html',
  styleUrls: ['./assessment-item.component.scss']
})
export class AssessmentItemComponent implements OnInit {
  @Input() assessment: Assesment;
  @Output() checkAssessment = new EventEmitter();
  isChecked: boolean = true;

  constructor(
    private router: Router,
    private assessmentService: AssessmentService,
    private helperService: HelperService
  ) { }

  ngOnInit(): void {
  }

  onCheckAssessment(data, status) {
    this.isChecked = !this.isChecked;
    let params = {
      data: data, status: status
    }
    this.checkAssessment.emit(params);
  }

  showPreviewAssessment(assessment: Assesment) {
    if (assessment.type == ASSESSMENTS_TYPE.IMocha) {
      const params = {
        id: assessment.assessmentId,
        type: assessment.type
      }
      this.assessmentService.getPreviewAssessmentEmployer(params).subscribe(url => {
        window.open(url, '_blank');
      }, err => {
        this.helperService.showToastError(err);
      });
    } else {
      this.router.navigate(['/add-custom-assessments'], { queryParams: { id: assessment.assessmentId, isEdit: false } });
    }
  }

}
