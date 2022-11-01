import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Job } from 'src/app/interfaces/job';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'ms-job-card',
  templateUrl: './job-card.component.html',
  styleUrls: ['./job-card.component.scss']
})

export class JobCardComponent implements OnInit {
  @Input() job: Job;
  @Output() apply = new EventEmitter();
  salaryType: string;
  isCompensation: boolean;

  constructor(
    public jobService: JobService
  ) {}

  ngOnInit(): void {
    this.salaryType = this.jobService.switchSalaryType(this.job.salaryType);
    this.isCompensation = this.jobService.switchProposedCompensation(this.job.proposedConpensation)
  }

  applyJob() {
    this.apply.emit();
  }
}
