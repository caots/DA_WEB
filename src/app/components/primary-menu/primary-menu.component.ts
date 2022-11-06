import { Location } from "@angular/common";
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { NOTIFICATION_STATUS, PAGING, PERMISSION_TYPE, USER_TYPE } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { ItemJobCarts } from 'src/app/interfaces/itemJobCarts';
import { Notification } from 'src/app/interfaces/notification';
import { PaginationConfig } from 'src/app/interfaces/paginattionConfig';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { AuthService } from 'src/app/services/auth.service';
import { HelperService } from 'src/app/services/helper.service';
import { MessageService } from 'src/app/services/message.service';
import { PermissionService } from 'src/app/services/permission.service';
import { PreviousRouteService } from "src/app/services/previous-route.service";
import { SubjectService } from 'src/app/services/subject.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ms-primary-menu',
  templateUrl: './primary-menu.component.html',
  styleUrls: ['./primary-menu.component.scss']
})

export class PrimaryMenuComponent implements OnInit {
  user: UserInfo;
  cards: ItemJobCarts[];
  listUserType = USER_TYPE;
  isShowFullMenu: boolean;
  isCurrentTab: string;
  permission = PERMISSION_TYPE;
  unread: number;
  isSearching: boolean
  isLoadingListConversation: boolean;
  dataConversation: any;
  currentLogoCompany: string;
  currentProfileEmployer: string;
  window: any;
  showModal: boolean = true;
  showModalWarning: boolean = true;
  previousUrlMessage: string;
  API_S3 = environment.api_s3;

  constructor(
    private router: Router,
    private location: Location,
    private authService: AuthService,
    private helperService: HelperService,
    private subjectService: SubjectService,
    public permissionService: PermissionService,
    private previousRouteService: PreviousRouteService,
  ) {
    this.router.events.subscribe(val => {
      const path = this.location.path();
      if (path == '/job-seeker-settings' || path == '/employer-settings') {
        this.isShowFullMenu = false;
      } else {
        this.isShowFullMenu = true;
      }
    })
  }
  header_variable = false;
  @HostListener("document:scroll")
  scrollfunction() {
    const pathNameUrl = window.location.pathname;
    if (pathNameUrl != '/home' && pathNameUrl != '/landing-employer' && pathNameUrl != '/landing-jobseeker') {
      this.header_variable = false;
    } else {
      if (document.body.scrollTop > 175 || document.documentElement.scrollTop > 175) {
        this.header_variable = true;
      }
      else {
        this.header_variable = false;
      }
    }
  }

  scroll() {
    const el = document.getElementById('footer');
    el.scrollIntoView({ behavior: "smooth" });
  }

  ngOnInit(): void {
    this.window = window;
    this.subjectService.user.subscribe(user => {
      this.user = user;
      if (!user) { return; }
      this.currentLogoCompany = this.user && this.user.employer_id > 0 ? this.user.employerInfo?.company_profile_picture : this.user?.company_profile_picture;
      this.currentLogoCompany;
      this.currentProfileEmployer = this.user.avatar;
    });
    this.subjectService.previousUrlMessage.subscribe(data => {
      if (data) this.previousUrlMessage = data;
    })
    this.subjectService.listCard.subscribe(data => {
      this.cards = data;
    });
  }

  isEmployer(): boolean {
    if (this.user) {
      return this.user.accountType == USER_TYPE.EMPLOYER;
    }

    return false;
  }

  async logout() {
    const isConfirmed = await this.helperService.confirmPopup(MESSAGE.TITLE_CONFIRM_LOGOUT);
    if (isConfirmed) {
      this.user = null;
      this.authService.logout();
      this.router.navigate(['/']);
    }
  }

  redirectToJobseeker(type) {
    this.isCurrentTab = type;
    this.router.navigate(['/job-seeker-profile', type]);
  }

  redirectToEmployer(type) {
    this.router.navigate(['/employer-profile', type]);
  }


  isTakeTesting() {
    const currentUrl = this.previousRouteService.getCurrentUrl();
    if (currentUrl.includes(`/job-seeker-test-assessments`)) {
      return true;
    }
    return false;
  }

  closeModal() {
    this.showModal = false;
  }
  closeModalWarnig() {
    this.showModalWarning = false;
  }

  checkLocationJobDetails() {
    return window.location.pathname.indexOf('/job/') >= 0;
  }

  goToMessage() {
    if (this.previousUrlMessage) {
      const queryParams = this.previousUrlMessage.split('?')[1];
      const paramsObj = JSON.parse('{"' + queryParams.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
      if (this.isEmployer()) this.router.navigate(['employer-messages'], { queryParams: paramsObj });
      else this.router.navigate(['/messages'], { queryParams: paramsObj });
    }
    else {
      if (this.isEmployer()) this.router.navigate(['/employer-messages']);
      else this.router.navigate(['/messages']);
    }
  }

}
