import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Job } from 'src/app/interfaces/job';
import { DataUpdate } from 'src/app/interfaces/questionCustomAssessment';
import { JobService } from 'src/app/services/job.service';
import { PreviousRouteService } from 'src/app/services/previous-route.service';

@Component({
  selector: 'ms-result-take-custom-assessment',
  templateUrl: './result-take-custom-assessment.component.html',
  styleUrls: ['./result-take-custom-assessment.component.scss']
})
export class ResultTakeCustomAssessmentComponent implements OnInit {
  @Output() close = new EventEmitter();
  @Input() resultAssessment: any;
  @Input() customAssessment: DataUpdate = new DataUpdate();
  @Input() isTimeUp: boolean;
  @Input() isAssessmentPage: boolean;
  @Input() jobInfo: Job;
  @Input() jobDashboard: any;

  constructor(
    private router: Router,
    private jobService: JobService,
    private previousRouteService: PreviousRouteService
  ) { }

  ngOnInit(): void {
  }

  goToResult() {
    // const previousRouter = this.previousRouteService.getPreviousUrl();
    // this.router.navigateByUrl(previousRouter);
    this.gotoJobDetail();
    this.close.emit();
  }
  gotoJobDetail() {
    const navigationExtras: NavigationExtras = {
      state: {
        apply: true
      }
    };
    // if (this.jobDashboard) {
    //   const conditionChangePage = Object.assign({}, this.jobDashboard, { page: 0 });
    //   this.router.navigate(['/job'], { queryParams: conditionChangePage });
    // } else
      if (!this.isAssessmentPage) this.router.navigate(['/job', this.jobInfo.urlSeo], navigationExtras);
      else this.router.navigate(['/job-seeker-assessments'], { queryParams: {name: this.customAssessment.name} });
  }
  closeModal() {
    // this.close.emit();
  }

}
