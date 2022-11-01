import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { USER_TYPE, ACTION_FOLLOW } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';

import { Job } from 'src/app/interfaces/job';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { AuthService } from 'src/app/services/auth.service';
import { HelperService } from 'src/app/services/helper.service';
import { JobService } from 'src/app/services/job.service';
import { SubjectService } from 'src/app/services/subject.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ms-company-preview-info',
  templateUrl: './company-preview-info.component.html',
  styleUrls: ['./company-preview-info.component.scss']
})
export class CompanyPreviewInfoComponent implements OnInit {

  @Input() jobDetails: Job;
  @Input() isSearchJobPage: boolean;
  @Input() listJobsFormEmployer: Job[] = [];
  imageObject: Array<object> = [];
  modalReportCompanyRef: NgbModalRef;
  user: UserInfo;
  listImages: any;
  companyID: number;
  companyLocation: string;
  USER_TYPE = USER_TYPE;
  listIdsEmplopyerFollowed: number[];
  checkEmployerFollowed: boolean;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private helperService: HelperService,
    private jobService: JobService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private subjectService: SubjectService
  ) {
  }

  ngOnInit(): void {
    //console.log('job details: ', this.jobDetails);
    this.subjectService.user.subscribe(user => {
      this.user = user;
    })
    this.subjectService.listIdEmployerFollows.subscribe(data => {
      if (!data) return;
      this.listIdsEmplopyerFollowed = data;
      const index = this.listIdsEmplopyerFollowed.findIndex(id => id == this.jobDetails?.employerId);
      if (index >= 0) this.checkEmployerFollowed = true;
    })
    this.listImages = this.jobDetails?.companyPhoto && JSON.parse(this.jobDetails?.companyPhoto);   
    if (this.listImages && this.listImages.length > 0) {      
      this.listImages.forEach(items => {
        if (items.url) {
          this.imageObject.push(
            {
              image: items.url,
              thumbImage: items.url,
              alt: items.name
            }
          )
          
        }
      });
    }
    this.companyLocation = `${this.jobDetails?.address ? `${this.jobDetails?.address} ` : ''}${this.jobDetails?.cityName ? `${this.jobDetails?.cityName}, ` : ''}${this.jobDetails?.stateName ? `${this.jobDetails?.stateName}` : ''}`;
    this.companyID = this.jobDetails?.employerId;
  }

  getLinkWebsiteCompany(url){
    return 'https://' + this.jobDetails.companyWebsite;
  }
}
