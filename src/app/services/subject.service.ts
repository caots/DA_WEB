import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { UserInfo } from 'src/app/interfaces/userInfo';
import { ItemJobCarts } from 'src/app/interfaces/itemJobCarts';
import { CardInfo, CardSettings } from '../interfaces/cardInfo';
import { Assesment } from '../interfaces/assesment';
import { JobCategory } from '../interfaces/jobCategory';
import { JobLevel } from '../interfaces/jobLevel';
import { ShowApplicant } from '../interfaces/applicants';
import { Notification } from 'src/app/interfaces/notification';

@Injectable({
  providedIn: 'root'
})

export class SubjectService {
  user = new BehaviorSubject<UserInfo>(null);
  userSurvey = new BehaviorSubject<any>(null);
  userPotentialsCategory = new BehaviorSubject<any>(null);
  listCard = new BehaviorSubject<ItemJobCarts[]>(null);
  listBookmark = new BehaviorSubject<number[]>([]);
  cart = new BehaviorSubject<CardInfo>(null);
  jobsCart = new BehaviorSubject<any[]>(null);
  isLoadingCard = new BehaviorSubject<boolean>(false);
  hiddenPaymentModal = new BehaviorSubject<boolean>(false);
  isSaveCard = new BehaviorSubject<number>(1);
  listAssessment = new BehaviorSubject<Assesment[]>([]);
  listCategory = new BehaviorSubject<JobCategory[]>([]);
  listLevel = new BehaviorSubject<JobLevel[]>([]);
  listFallUnder = new BehaviorSubject<string[]>([]);
  settingsCard = new BehaviorSubject<CardSettings>(null);
  isShowApplicant = new BehaviorSubject<ShowApplicant>(null);
  tabListJobJobSeeker = new BehaviorSubject<string>(null);
  listIdEmployerFollows = new BehaviorSubject<any>(null);
  isShowModalActiveEmail = new BehaviorSubject<any>(null);
  checkRateResponsive = new BehaviorSubject<any>(null);
  checkPaymentUpgradeDone = new BehaviorSubject<any>(false);
  checkPaymentTopupDone = new BehaviorSubject<any>(false);
  checkPaymentAddApplicantsDone = new BehaviorSubject<any>(false);
  addMsgToListMedia = new BehaviorSubject<any>(false);
  unReadNotification = new BehaviorSubject<number>(null);
  listNotificationUnRead = new BehaviorSubject<Notification[]>(null);
  totalNotification = new BehaviorSubject<number>(null);
  previousUrlMessage = new BehaviorSubject<string>(null);
  switchStepCreateJob = new BehaviorSubject<any>(null);
  isAllowNextStepCreateJob = new BehaviorSubject<boolean>(true);
  isShowModalApplyJobNoLogin = new BehaviorSubject<any>(null);
  constructor() { }
}
