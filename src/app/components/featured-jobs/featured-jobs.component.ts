import { Component, OnInit } from '@angular/core';
import { NUMBER_FEATURE_JOB_HOMEPAGE, SEARCH_JOB_TYPE, SALARY_TYPE } from 'src/app/constants/config';
import { Job } from 'src/app/interfaces/job';
import { HelperService } from 'src/app/services/helper.service';
import { JobService } from 'src/app/services/job.service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ms-featured-jobs',
  templateUrl: './featured-jobs.component.html',
  styleUrls: ['./featured-jobs.component.scss']
})
export class FeaturedJobsComponent implements OnInit {
  listFeatureJob: Job[] = [];
  API_S3 = environment.api_s3;
  isLoadingListJob: boolean;
  listImageSlide = [
    { value: `${this.API_S3}/cdn/bg-22.webp` },
    { value: `${this.API_S3}/cdn/bg-23.webp` },
    { value: `${this.API_S3}/cdn/bg-24.webp` },
  ];
  isCheckDangerTime: boolean = false;
  currentPage = 1;
  condition: any;
  jobJobseekerConfig = {
    direction: "vertical",
    autoHeight: true,
    slidesPerView: 2,
    loop: true,
    freeMode: true,
    mousewheel: {
      releaseOnEdges: true,
    },
    scrollbar: false,
    navigation: true,
    centeredSlides: false,
    spaceBetween: 16,
    autoplay: false,
  };
  isShowDefaultJob: boolean;

  constructor(
    private jobService: JobService,
    private helperService: HelperService
  ) { }

  ngOnInit(): void {
    this.condition = { page: 0, pageSize: NUMBER_FEATURE_JOB_HOMEPAGE, searchType: SEARCH_JOB_TYPE.Hot }
    this.getListFeatureJob(this.condition);
  }

  getListFeatureJob(condition, addMore = false) {
    this.isLoadingListJob = true;
    this.jobService.getListJobOfJobSeeker(condition).subscribe(data => {
      this.isLoadingListJob = false;
      data.listJob && data.listJob.map(job => {
        this.listFeatureJob.unshift(job);
      });
      if (this.listFeatureJob.length == 0) {
        this.isShowDefaultJob = true;
      }
      if (addMore) this.currentPage = this.currentPage + 1;
      // format description job    
      this.listFeatureJob = this.listFeatureJob.map(job => {
        if(job?.description) job.description = this.extractContent(job.description);
        return job;
      })  
    }, err => {
      this.isLoadingListJob = false;
      this.helperService.showToastError(err);
    })
  }

  extractContent(s){
    const span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
  };

  subDateHotJob(endHotJob: Date) {
    const endDate = moment(endHotJob);
    const nowDate = moment(new Date());
    const days = endDate.diff(nowDate, 'days');
    const hours = endDate.diff(nowDate, 'hours') - days * 24;
    const minus = endDate.diff(nowDate, 'minutes') - days * 24 * 60 - hours * 60;
    if (days == 0 && hours < 6) this.isCheckDangerTime = true;
    return `${days}d ${hours}h ${minus}m`
  }

  subTimeHotJob(endHotJob: Date) {
    const timeEndDate = moment(endHotJob).format('LT');
    const MonthEndDate = moment(endHotJob).format('MM/DD');
    const dayEndDate = moment(endHotJob).format('dddd');
    return `${dayEndDate}, ${MonthEndDate} ${timeEndDate}`

  }

  getSalaryType(id) {
    const index = SALARY_TYPE.findIndex(type => type.id == id);
    if (index >= 0) return SALARY_TYPE[index].title;
    return '';
  }

  public onSlideChange(event) {
    if (this.listFeatureJob.length < this.currentPage * NUMBER_FEATURE_JOB_HOMEPAGE) return;
    const indexSlide = event?.realIndex;
    if (indexSlide === this.listFeatureJob.length - 1) {
      this.condition.page = this.currentPage;
      this.getListFeatureJob(this.condition, true);
    }
  }

}
