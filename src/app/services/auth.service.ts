import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { SIGN_UP_STEP, STORAGE_KEY, USER_TYPE } from 'src/app/constants/config';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { StorageService } from 'src/app/services/storage.service';
import { SubjectService } from 'src/app/services/subject.service';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    private subjectService: SubjectService,
    private messageService: MessageService,
  ) { }

  saveToken(token: string) {
    return this.storageService.set(STORAGE_KEY.ACCESS_TOKEN, token);
  }

  getToken(): string {
    return this.storageService.get(STORAGE_KEY.ACCESS_TOKEN);
  }

  saveUser(user) {
    return this.storageService.set(STORAGE_KEY.USER_INFO, user);
  }

  getUser() {
    return this.storageService.get(STORAGE_KEY.USER_INFO);
  }

  saveRole(role: number) {
    return this.storageService.set(STORAGE_KEY.ROLE, role);
  }

  getRole(): number {
    return this.storageService.get(STORAGE_KEY.ROLE);
  }

  isLogin(): boolean {
    const token = this.getToken();
    return token ? true : false;
  }

  login(user) {
    const url = `${environment.api_url}user/login`;
    return this.httpClient.post(url, user);
  }

  signupPotentialsUSer(user) {
    const url = `${environment.api_url}user-potentials/create`;
    return this.httpClient.post(url, user);
  }

  logout() {
    this.storageService.removeItem(STORAGE_KEY.ACCESS_TOKEN);
    this.storageService.removeItem(STORAGE_KEY.ROLE);
    this.messageService.disconnect();
    this.subjectService.user.next(null);
    this.subjectService.userSurvey.next(null);
    this.subjectService.userPotentialsCategory.next(null);
    this.subjectService.cart.next(null);
    this.subjectService.listCard.next(null);
    this.subjectService.checkRateResponsive.next(null);
    this.subjectService.tabListJobJobSeeker.next(null);
    this.subjectService.listIdEmployerFollows.next(null);
    this.subjectService.unReadNotification.next(null);
    this.subjectService.totalNotification.next(null);
    this.subjectService.previousUrlMessage.next(null);
  }

  register(user) {
    const url = `${environment.api_url}user/verifiedCode`;
    return this.httpClient.post(url, user);
  }

  verifyPhoneNumber(data) {
    const url = `${environment.api_url}user/sendCode`;
    return this.httpClient.post(url, data);
  }

  getUserInfo(): Observable<UserInfo> {
    const url = `${environment.api_url}user?version=${Date.now()}`;
    return this.httpClient.get<UserInfo>(url).pipe(map((user: any) => {
      const userMap = this.mapUserInfo(user);
      this.subjectService.user.next(userMap);
      this.subjectService.userPotentialsCategory.next(userMap.user_potentials_categories);
      return userMap;
    }))
  }

  forgotPassword(email) {
    const url = `${environment.api_url}user/forgotPassword`
    return this.httpClient.post(url, email)
  }

  resetPassword(data) {
    const url = `${environment.api_url}user/setPassword`
    return this.httpClient.post(url, data)
  }

  verifyEmail(token) {
    const url = `${environment.api_url}user/activeAccount`
    return this.httpClient.post(url, token)
  }

  verifyChangeEmail(token) {
    const url = `${environment.api_url}user/verifiedEmail`
    return this.httpClient.post(url, token)
  }

  changeEmail(email) {
    let body = { email: email }
    const url = `${environment.api_url}user/changeEmail`
    return this.httpClient.post(url, body)
  }

  getDelegateInfo(body) {
    const url = `${environment.api_url}user/getDelegateInfo`
    return this.httpClient.post(url, body)
  }

  mapUserInfo(user): UserInfo {
    const userMap = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      accountType: user.acc_type,
      signUpStep: user.employer_id > 0 ? SIGN_UP_STEP.STEP2 : user.sign_up_step,
      phone: user.phone_number,
      region_code: user.region_code,
      companyName: user.company_name,
      company_id: user.company_id,
      address: user.address_line,
      salary: user.asking_salary,
      benefits: user.asking_benefits,
      description: user.description,
      cityName: user.city_name,
      stateName: user.state_name,
      companyMinSize: user.company_size_min,
      companyMaxSize: user.company_size_max,
      avatar: user.profile_picture ? `${user.profile_picture}?version=${Date.now()}` : '',
      industry: user.employer_industry,
      referLink: user.refer_link,
      revenueSizeMin: user.employer_revenue_min,
      revenueSizeMax: user.employer_revenue_max,
      yearFounded: user.employer_year_founded,
      companyPhoto: user.employer_company_photo,
      ceoPicture: user.employer_ceo_picture,
      ceoName: user.employer_ceo_name,
      companyWebsite: user.employer_company_url,
      companyFacebook: user.employer_company_facebook,
      twitterPage: user.employer_company_twitter,
      companyVideo: user.employer_company_video,
      isUserDeleted: user.is_user_deleted,
      isDeleted: user.is_deleted,
      employerId: user.employer_id ? user.employer_id : 0,
      permissions: user.permissions ? user.permissions : null,
      employerInfo: user.employer_info ? this.mapUserMemberCompanyInfo(user.employer_info) : null,
      acc_type: user.acc_type,
      company_name: user.company_name,
      employer_title: user.employer_title,
      employer_id: user.employer_id ? user.employer_id : 0,
      chat_group_id: user.chat_group_id,
      userResponsive: user.user_responsive,
      converge_ssl_token: user.converge_ssl_token,
      nbrCredits: user.nbr_credits ? Math.floor(user.nbr_credits) : 0,
      nbrFreeCredits: user.nbr_free_credits ? user.nbr_free_credits : 0,
      zip_code: user.zip_code || '',
      email_verified: user.email_verified || 0,
      enable_show_avatar: user.enable_show_avatar,
      company_profile_picture: user.company_profile_picture,
      askingSalaryType: user.asking_salary_type || 0,
      billingInfo: user.billingInfo,
      is_subscribe: user.is_subscribe,
      user_potentials_categories: user.user_potentials_categories || null,
      is_user_potentials: user.is_user_potentials || false
      // company_profile_picture: user.company_profile_picture ? `${user.company_profile_picture}?version=${Date.now()}` : ''
    } as UserInfo;
    return userMap;
  }

  mapUserMemberCompanyInfo(user) {
    const userMap = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      user_potentials_categories: user.user_potentials_categories || null,
      accountType: user.acc_type,
      signUpStep: user.sign_up_step,
      phone: user.phone_number,
      region_code: user.region_code,
      companyName: user.company_name,
      address: user.address_line,
      salary: user.asking_salary,
      benefits: user.asking_benefits,
      description: user.description,
      cityName: user.city_name,
      stateName: user.state_name,
      companyMinSize: user.company_size_min,
      companyMaxSize: user.company_size_max,
      avatar: user.profile_picture ? `${user.profile_picture}?version=${Date.now()}` : '',
      industry: user.employer_industry,
      referLink: user.refer_link,
      revenueSizeMin: user.employer_revenue_min,
      revenueSizeMax: user.employer_revenue_max,
      yearFounded: user.employer_year_founded,
      companyPhoto: user.employer_company_photo,
      ceoPicture: user.employer_ceo_picture,
      ceoName: user.employer_ceo_name,
      companyWebsite: user.employer_company_url,
      companyFacebook: user.employer_company_facebook,
      twitterPage: user.employer_company_twitter,
      companyVideo: user.employer_company_video,
      isUserDeleted: user.is_user_deleted,
      isDeleted: user.is_deleted,
      acc_type: user.acc_type,
      company_name: user.company_name,
      employer_title: user.employer_title,
      employer_id: user.employer_id ? user.employer_id : 0,
      converge_ssl_token: user.converge_ssl_token,
      zip_code: user.zip_code || '',
      email_verified: user.email_verified || 0,
      enable_show_avatar: user.enable_show_avatar,
      company_profile_picture: user.company_profile_picture,
      askingSalaryType: user.asking_salary_type || 0,
      billingInfo: user.billingInfo,
      is_subscribe: user.is_subscribe,
      nbrCredits: user.nbr_credits ? Math.floor(user.nbr_credits) : 0,
      nbrFreeCredits: user.nbr_free_credits ? user.nbr_free_credits : 0,
      // company_profile_picture: user.company_profile_picture ? `${user.company_profile_picture}?version=${Date.now()}` : ''
    }
    return userMap;
  }
}
