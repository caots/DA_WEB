import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HelperService } from 'src/app/services/helper.service';
import { JobService } from 'src/app/services/job.service';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { Job } from 'src/app/interfaces/job';
import { SubjectService } from 'src/app/services/subject.service';
import { JOB_ORDER } from 'src/app/constants/config';

@Component({
  selector: 'ms-preview-job-employer',
  templateUrl: './preview-job-employer.component.html',
  styleUrls: ['./preview-job-employer.component.scss']
})
export class PreviewJobEmployerComponent implements OnInit {
  isSearchJobPage: boolean = false;
  jobInfoTab: boolean;
  companyInfoTab: boolean;
  activeJob: boolean;
  isCallingApi: boolean;
  user: UserInfo;
  jobDetails: Job;
  listJobsFormEmployer: Job;

  constructor(
    private jobService: JobService,
    private helperService: HelperService,
    private location: Location,
    private subjectService: SubjectService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      if (params['tab'] === 'employer') {
        this.companyInfoTab = true;
        this.jobInfoTab = false;
      } else {
        this.companyInfoTab = false;
        this.jobInfoTab = true;
      }
      if (params && params.searchJob) this.isSearchJobPage = true;
      if (params && params.activeJob) this.activeJob = true;

      this.subjectService.user.subscribe(user => {
        this.user = user;
        if (this.user){
          if (params && params.id) {
            if (this.isSearchJobPage) this.getJobDetail(params.id);
          } else this.getCompanyDetails(this.user.company_id);
        } 
      })
     
    })
  }

  changeTabs(tabName) {
    if (tabName === 'job-info') {
      this.jobInfoTab = true;
      this.companyInfoTab = false;
    } else {
      this.jobInfoTab = false;
      this.companyInfoTab = true;
    }
  }

  getJobDetail(id) {
    this.isCallingApi = true;
    this.jobService.getjobDetailsEmployer(Number(id)).subscribe(res => {
      this.jobDetails = res;
      this.isCallingApi = false;
      this.getCompanyDetails(this.user.company_id);
      this.getListJobsFromThisEmp(this.jobDetails.employerId, id);
    }, errorRes => {
      this.isCallingApi = false;
      this.helperService.showToastError(errorRes);
    })
  }

  getListJobsFromThisEmp(empID, currentJobId) {
    this.jobService.getListJobsFromThisEmployer({
      orderNo: JOB_ORDER.BEST_MATCH,
      searchType: "",
      userId: empID
    }).subscribe(res => {
      this.listJobsFormEmployer = res.listJob.filter(item => {
        return item.id != currentJobId;
      });
    }, err => {
      this.helperService.showToastSuccess(err);
    })
  }

  getCompanyDetails(id) {
    if(!id) return;
    this.isCallingApi = true;
    this.jobService.getCompanySearchDetails(Number(id)).subscribe(data => {
      this.jobDetails = {...this.jobDetails, cityJob: this.jobDetails?.cityName, stateJob: this.jobDetails?.stateName , ...data};
      this.isCallingApi = false;
    }, err => {
      this.isCallingApi = false;
      this.helperService.showToastError(err);
    });
  }

  goBack() {
    this.location.back();
  }

}
