import { Component, Input, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import * as moment from 'moment';
import { HelperService } from 'src/app/services/helper.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NOTIFICATION_STATUS, PAGING, NOTIFICATION_TYPE, USER_TYPE } from 'src/app/constants/config';
import { SubjectService } from 'src/app/services/subject.service';
import { Notification } from 'src/app/interfaces/notification';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { CardSettings } from 'src/app/interfaces/cardInfo';
import { PaymentService } from 'src/app/services/payment.service';
import { NavigationExtras, Router } from '@angular/router';
import { JobService } from 'src/app/services/job.service';
import { companySearch } from 'src/app/interfaces/company';
@Component({
  selector: 'ms-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  listNotification: Notification[] = [];
  totalNotification: number;
  params: Object;
  isCheckNotifi: boolean = true;
  NOTIFICATION_TYPE = NOTIFICATION_TYPE;
  NOTIFICATION_STATUS = NOTIFICATION_STATUS;
  PAGING = PAGING;
  currentPage: number = 2;
  user: UserInfo;
  settingsCard: CardSettings;
  listCompany: companySearch[];
  USER_TYPE = USER_TYPE;
  defaultCompanyProfilePicture: string = 'assets/images/employer_default_photo_1.png';

  @Output() changeStatusNotification = new EventEmitter();
  @Output() closeDropdown = new EventEmitter();
  @Input() isMobile: any = 0;

  constructor(
    private router: Router,
    private jobService: JobService,
    private subjectService: SubjectService,
    private helperService: HelperService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.subjectService.user.subscribe(data => {
      if (!data) return;
      this.user = data;
    });
    this.subjectService.settingsCard.subscribe(data => {
      if (!data) return;
      this.settingsCard = data;
    })
    this.subjectService.listNotificationUnRead.subscribe(data => {
      this.listNotification = data;
      if (!data) return;
      this.convertDataNoti();
    });
    this.subjectService.totalNotification.subscribe(data => {
      if (!data) return;
      this.totalNotification = data;
    });
    this.getAllCompnay();
  }

  convertDataNoti() {
    this.listNotification.forEach(noti => {
      if (
        noti.type == NOTIFICATION_TYPE.NewPostsJobseekers ||
        noti.type == NOTIFICATION_TYPE.JobseekerIsInvited ||
        noti.type == NOTIFICATION_TYPE.ReminderSavedJobExpire ||
        noti.type == NOTIFICATION_TYPE.ReminderCompleteApplication||
        noti.type == NOTIFICATION_TYPE.AccountActiveInvite
      ) {
        return noti.metadata = typeof noti.metadata === 'string' ? JSON.parse(noti.metadata) : noti.metadata;
      }
    })
  }

  getAllCompnay() {
    const params = { page: 0, pageSize: 10000 };
    this.jobService.getListCompanyOfJobSeeker(params).subscribe(data => {
      this.listCompany = data;
    });
  }

  checkNotification() {
    this.changeStatusNotification.emit(this.isCheckNotifi);
  }

  viewMoreNotification() {
    const params = {
      is_read: this.isCheckNotifi ? NOTIFICATION_STATUS.ALL : NOTIFICATION_STATUS.UN_READ,
      page: 0,
      pageSize: PAGING.MAX_ITEM_NOTIFICATION * this.currentPage
    }
    this.getListNotification(params, true);
  }

  getListNotification(params, viewMore = false) {
    this.notificationService.getListNotification(params).subscribe(data => {
      this.listNotification = data.listNoti;
      this.currentPage = this.currentPage + 1;
      this.subjectService.listNotificationUnRead.next(data.listNoti);
      this.subjectService.totalNotification.next(data.total);
    }, err => {
      this.helperService.showToastError(err);
    })
  }

  makeReadListNotification() {
    let ids = [];
    this.listNotification.map(notification => {
      if (notification.type == NOTIFICATION_TYPE.PasswordChange || notification.type == NOTIFICATION_TYPE.AccountActiveInvite || notification.type == NOTIFICATION_TYPE.ReferralCredit) {
        if (notification.is_read == NOTIFICATION_STATUS.UN_READ) ids.push(notification.id);
      }
    });
    if (ids.length <= 0) return;
    this.notificationService.markReadMultiNotification(ids.toString()).subscribe(() => {
      this.notificationService.getTotalNotification().subscribe();
    })
  }

  differentTime(date) {
    const timeNoti = moment(new Date(date));
    const dateNow = moment(new Date());
    return timeNoti.from(dateNow);
  }

  goToJobsDetails(notification, showModal = false) {
    // read notification
    if (notification.is_read == NOTIFICATION_STATUS.UN_READ) this.readNotification(notification);
    // redirect job details
    const urlJob = this.jobService.deleteSpecialText(this.helperService.convertToSlugUrl(notification?.metadata?.jobDetails?.title, notification?.metadata?.jobDetails?.id));
    const navigationExtras: NavigationExtras = {
      state: {
        apply: showModal
      }
    };
    this.router.navigate(['/job', urlJob], navigationExtras);
    // hidden modal noti
    this.closeDropdown.emit();
  }

  readNotification(notification) {
    this.notificationService.markReadNotification(notification.id).subscribe(() => {
      const params = {
        is_read: this.isCheckNotifi ? NOTIFICATION_STATUS.ALL : NOTIFICATION_STATUS.UN_READ,
        page: 0,
        pageSize: PAGING.MAX_ITEM_NOTIFICATION
      } 
      if(this.isCheckNotifi){
        const index = this.listNotification.findIndex(noti => noti.id == notification.id);
        this.listNotification[index].is_read = NOTIFICATION_STATUS.READ;
        this.subjectService.listNotificationUnRead.next(this.listNotification);
      }else{
        this.getListNotification(params);
      }
      this.notificationService.getTotalNotification().subscribe();
    })
  }

  getLogoCompany(notification) {
    const company = this.listCompany && this.listCompany.find(company => company.companyID == notification?.metadata?.jobDetails?.employer_id);
    if (company) return company.companProfilePicture;
    else return this.defaultCompanyProfilePicture;
  }

  getNameEmployer(notification) {
    const company = this.listCompany && this.listCompany.find(company => company.companyID == notification?.metadata?.jobDetails?.employer_id);
    if (company) return company.companyName;
    else return '';
  }

  checkthisBottom(e) {
    if (e.target.scrollHeight < e.target.scrollTop + e.target.offsetHeight + 10) {
      if(this.listNotification.length >= this.totalNotification) return;
      this.viewMoreNotification();
    }
  }

}
