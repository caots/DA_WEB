import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { SALARY_TYPE } from 'src/app/constants/config';
import { Job } from 'src/app/interfaces/job';
import * as moment from 'moment';
@Component({
  selector: 'ms-other-jobs-card',
  templateUrl: './other-jobs-card.component.html',
  styleUrls: ['./other-jobs-card.component.scss']
})
export class OtherJobsCardComponent implements OnInit {
  @Input() jobs: Job;
  salaryType: string;
  isCheckDangerTime: boolean = false;

  constructor() { }

  ngOnInit(): void {
    if (this.jobs.salaryType !== null) {
      const item = SALARY_TYPE.find(x => x.id === this.jobs.salaryType);
      if (item) {
        this.salaryType = item.title;
      }
    }
  }

  subDateHotJob(endHotJob: Date){    
    const endDate = moment(endHotJob);
    const nowDate = moment(new Date());
    const days = endDate.diff(nowDate, 'days');
    const hours = endDate.diff(nowDate, 'hours') - days * 24;
    const minus = endDate.diff(nowDate, 'minutes') - days * 24 * 60 - hours * 60;
    if(days == 0 && hours < 6) this.isCheckDangerTime = true;
    return `${days}d ${hours}h ${minus}m`
  }

  subTimeHotJob(endHotJob: Date){
    const timeEndDate = moment(endHotJob).format('LT');
    const MonthEndDate = moment(endHotJob).format('MM/DD');
    const dayEndDate = moment(endHotJob).format('dddd');
    return `${dayEndDate}, ${MonthEndDate} ${timeEndDate}`

  }

}
