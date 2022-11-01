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
  selector: 'ms-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss']
})
export class CompanyInfoComponent implements OnInit {
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
      const index = this.listIdsEmplopyerFollowed.findIndex(id => id == this.jobDetails.employerId);
      if (index >= 0) this.checkEmployerFollowed = true;
    })
    this.listImages = JSON.parse(this.jobDetails.companyPhoto);
    if (this.listImages) {
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
    this.companyLocation = `${this.jobDetails.address ? `${this.jobDetails.address} ` : ''}${this.jobDetails.company_city_name ? `${this.jobDetails.company_city_name}, ` : ''}${this.jobDetails.company_state_name ? `${this.jobDetails.company_state_name}` : ''}`;
    this.companyID = this.jobDetails.employerId;
  }

  getLinkWebsiteCompany(url){
    return 'https://' + this.jobDetails.companyWebsite;
  }

  followEmployer(status) {
    const action = status ? ACTION_FOLLOW.unfollow : ACTION_FOLLOW.follow;
    if (action == ACTION_FOLLOW.unfollow) this.onUnFollow(action, status);
    else this.onToggleFollowEmolyer(action, status);
  }

  async onUnFollow(action, status) {
    const isConfirmed = await this.helperService.confirmPopup(`Are you sure you want to unfollow ${this.jobDetails.companyName}?`, MESSAGE.BTN_YES_TEXT);
    if (isConfirmed) {
      this.onToggleFollowEmolyer(action, status);
    }
  }

  goToLogin() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onToggleFollowEmolyer(action, status) {
    if (!this.user) {
      this.goToLogin();
      return;
    }
    this.jobService.followEmployer(this.companyID, action).subscribe(data => {
      this.helperService.showToastSuccess(action == ACTION_FOLLOW.follow ? MESSAGE.UPDATE_FOLLOW_SUCCESSFULY : MESSAGE.UPDATE_UNFOLLOW_SUCCESSFULY);
      this.checkEmployerFollowed = !status;
      this.jobService.getListIdCompanyFollowed().subscribe();
    }, err => {
      this.helperService.showToastError(err);
    })
  }

  zoomInOut(scale) {
    //console.log(scale)
    // this.scale = this.minScale + (scale / 500);
  }

  async showModalReportCompany(modalReportCompany) {
    if (this.user) {
      this.modalReportCompanyRef = this.modalService.open(modalReportCompany, {
        windowClass: 'modal-report-company',
        size: 'l'
      })
    } else {
      this.router.navigate(['/login']);
    }
  }


}
