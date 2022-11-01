import { Location } from "@angular/common";
import { Router, NavigationEnd } from "@angular/router";
import { Component, HostListener, OnInit } from '@angular/core';
import { ElementRef } from '@angular/core';

import { USER_TYPE, PERMISSION_TYPE, NOTIFICATION_STATUS, PAGING, NOTIFICATION_TYPE } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { ItemJobCarts } from 'src/app/interfaces/itemJobCarts';
import { AuthService } from 'src/app/services/auth.service';
import { PermissionService } from 'src/app/services/permission.service';
import { HelperService } from 'src/app/services/helper.service';
import { SubjectService } from 'src/app/services/subject.service';
import { MessageService } from 'src/app/services/message.service';
import { PaginationConfig } from 'src/app/interfaces/paginattionConfig';
import { environment } from 'src/environments/environment';
import { SearchConversation } from 'src/app/interfaces/search';
import { PreviousRouteService } from "src/app/services/previous-route.service";
import { LocationService } from "src/app/services/location.service";
import { NotificationService } from "src/app/services/notification.service";
import { Notification } from 'src/app/interfaces/notification';

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
  paginationConversationConfig: PaginationConfig;
  isSearching: boolean
  isLoadingListConversation: boolean;
  dataConversation: any;
  currentLogoCompany: string;
  currentProfileEmployer: string;
  window: any;
  showModal: boolean = true;
  showModalWarning: boolean = true;
  paramsNotification: any;
  totalUnReadNotification: number;
  listNotification: Notification[];
  previousUrlMessage: string;
  API_S3 = environment.api_s3;

  constructor(
    private router: Router,
    private myElement: ElementRef,
    private location: Location,
    private authService: AuthService,
    private helperService: HelperService,
    private subjectService: SubjectService,
    public permissionService: PermissionService,
    private messageService: MessageService,
    private previousRouteService: PreviousRouteService,
    private locationService: LocationService,
    private notificationService: NotificationService
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
    this.paramsNotification = {
      is_read: NOTIFICATION_STATUS.ALL,
      page: 0,
      pageSize: PAGING.MAX_ITEM_NOTIFICATION
    }
    if (new Date() > new Date('2021-12-24')) this.showModalWarning = false;
    setTimeout(() => {
      this.showModal = false;
    }, 30000);
    setTimeout(() => {
      this.showModalWarning = false;
    }, 10000);
    this.window = window;
    this.subjectService.user.subscribe(user => {
      this.user = user;
      if (!user) { return; }
      this.currentLogoCompany = this.user && this.user.employer_id > 0 ? this.user.employerInfo?.company_profile_picture : this.user?.company_profile_picture;
      this.currentLogoCompany;
      this.currentProfileEmployer = this.user.avatar;

      this.getTotalNotification();
      this.getAllListNotification(this.paramsNotification);
    });
    this.subjectService.previousUrlMessage.subscribe(data => {
      if (data) this.previousUrlMessage = data;
    })
    this.subjectService.listCard.subscribe(data => {
      this.cards = data;
    });
    this.subjectService.unReadNotification.subscribe(data => {
      this.totalUnReadNotification = data;
    });
    this.messageService.Unread.subscribe(unread => {
      this.unread = unread;
    });
    this.subjectService.listNotificationUnRead.subscribe(data => {
      this.listNotification = data;
    });
    this.paginationConversationConfig = {
      currentPage: 0,
      totalRecord: 0,
      maxRecord: 20
    }
    // this.locationService.getPosition().then((res) => {
    //   //console.log(res);
    // }).catch((err) => {
    //   console.error(err);
    // });
    if (this.authService.isLogin()) {
      // this.getListConversation();
      this.messageService.getCountMessageUnread().subscribe();
    }

    this.paramsNotification = {
      is_read: NOTIFICATION_STATUS.ALL,
      page: 0,
      pageSize: PAGING.MAX_ITEM_NOTIFICATION
    }
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

  getListConversation() {
    this.isLoadingListConversation = true;
    let condition = this.getSearchConditionListConversation();
    const querySearch = new SearchConversation();
    Object.assign(condition, querySearch);
    this.messageService.getListConversation(condition).subscribe(res => {
      this.isSearching = false;
      this.isLoadingListConversation = false;
      this.paginationConversationConfig.totalRecord = res.total;
      var groups = {};
      for (let i = 0; i < res.listConversation.length; i++) {
        let groupName = res.listConversation[i].job_id;
        if (!groups[groupName]) {
          groups[groupName] = [];
        }
        groups[groupName].push({
          job_title: res.listConversation[i].job_title,
          group_id: res.listConversation[i].group_id,
          job_id: res.listConversation[i].job_id,
          msg_content: res.listConversation[i].msg_content,
          msg_content_type: res.listConversation[i].msg_content_type,
          msg_sender_first_name: res.listConversation[i].msg_sender_first_name,
          msg_sender_last_name: res.listConversation[i].msg_sender_last_name,
          jobSeeker_first_name: res.listConversation[i].jobSeeker_first_name,
          jobSeeker_last_name: res.listConversation[i].jobSeeker_last_name,
          can_view_profile: res.listConversation[i].can_view_profile,
          jobSeeker_profile_picture: `${res.listConversation[i].jobSeeker_profile_picture}`,
          msg_sender_profile_picture: `${res.listConversation[i].msg_sender_profile_picture}`,
          msg_id: res.listConversation[i].msg_id,
          read_message_id: res.listConversation[i].read_message_id
        });
      }
      this.dataConversation = [];
      for (let groupName in groups) {
        this.dataConversation.push({ group: groupName, groupId: groups[groupName][0].group_id, job_title: groups[groupName][0].job_title, conversation: groups[groupName] });

      }
      this.dataConversation = this.dataConversation[0]
    }, err => {
      this.isSearching = false;
      this.isLoadingListConversation = false;
      this.helperService.showToastError(err);
    })
  }

  getSearchConditionListConversation() {
    let condition: any = {
      page: this.paginationConversationConfig.currentPage,
      pageSize: this.paginationConversationConfig.maxRecord,
    }

    // if (this.querySearch.category) {
    //   let numberCategory = this.querySearch.category[0]?.id
    //   condition.categoryId = numberCategory;
    // }

    return condition;
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

  getAllListNotification(params) {
    this.notificationService.getListNotification(params).subscribe(data => {
      this.listNotification = data.listNoti;
      this.subjectService.listNotificationUnRead.next(data.listNoti);
      this.subjectService.totalNotification.next(data.total);
    }, err => {
      this.helperService.showToastError(err);
    })
  }

  getTotalNotification() {
    this.notificationService.getTotalNotification().subscribe(data => {
    }, err => {
      this.helperService.showToastError(err);
    })
  }

  changeStatusNotification(check) {
    this.paramsNotification.is_read = check ? NOTIFICATION_STATUS.ALL : NOTIFICATION_STATUS.UN_READ;
    this.getAllListNotification(this.paramsNotification);
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

  changeModalNoti(isOpenModal) {
    // if (!isOpenModal) return;
    // let ids = [];
    // this.listNotification && this.listNotification.map(notification => {
    //   if (notification.type == NOTIFICATION_TYPE.PasswordChange || notification.type == NOTIFICATION_TYPE.AccountActiveInvite || notification.type == NOTIFICATION_TYPE.ReferralCredit) {
    //     if (notification.is_read == NOTIFICATION_STATUS.UN_READ) ids.push(notification.id);
    //   }
    // })
    // console.log(ids);
    // if (ids.length <= 0) return;

    // this.notificationService.markReadMultiNotification(ids.toString()).subscribe(() => {
    //   this.notificationService.getTotalNotification().subscribe();
    //   this.getAllListNotification(this.paramsNotification);
    // })
  }
}
