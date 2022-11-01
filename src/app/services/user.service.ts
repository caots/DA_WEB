import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';

import { environment } from 'src/environments/environment';
import { JobseekerAssessment } from '../interfaces/jobseekerAssessment';
import { SubjectService } from './subject.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  user: any;
  assessment = new BehaviorSubject<JobseekerAssessment>(null);
  constructor(
    private httpClient: HttpClient,
    private socket: Socket,
    private subjectService: SubjectService
  ) {
  }
  private _convertObjectToQuery(obj) {
    let query = '';
    for (let key in obj) {
      if (obj[key] !== undefined) {
        if (query) {
          query += `&${key}=${obj[key]}`;
        } else {
          query += `${key}=${obj[key]}`;
        }
      }
    }

    return query;
  }
  updateUser(user) {
    const url = `${environment.api_url}user`;
    return this.httpClient.put(url, user);
  }

  createUserSurvey(user) {
    const url = `${environment.api_url}user/survey`;
    return this.httpClient.post(url, user);
  }

  updateUserSurvey(body) {
    const url = `${environment.api_url}user/survey`;
    return this.httpClient.put(url, body);
  }

  getUserSurvey() {
    const url = `${environment.api_url}user/survey`;
    return this.httpClient.get<any>(url).pipe(map((userSurvey: any) => {
      this.subjectService.userSurvey.next(userSurvey);
      return userSurvey;
    }))
  }

  completeDelegateAccount(user) {
    const url = `${environment.api_url}user/completeDelegateAccount`;
    return this.httpClient.post(url, user);
  }

  completeUserPotentials(user) {
    const url = `${environment.api_url}user-potentials/complete-signup`;
    return this.httpClient.post(url, user);
  }

  updateUserProfile(user) {
    const url = `${environment.api_url}user/profile`;
    return this.httpClient.put(url, user);
  }

  deleteEmployerPhoto(data) {
    const url = `${environment.api_url}user/delete-photo`;
    return this.httpClient.post(url, data);
  }

  unsubscribeReceive(data) {
    const url = `${environment.api_url}user/unsubcribeReceiveUpdate`;
    return this.httpClient.post(url, data);
  }

  deleteUser(user) {
    const url = `${environment.api_url}user`;
    return this.httpClient.delete(url, user);
  }

  checkExistedEmail(data) {
    const url = `${environment.api_url}user/checkMail`;
    return this.httpClient.post(url, data);
  }

  completeSignUpStep() {
    const url = `${environment.api_url}user/completedSignup`;
    return this.httpClient.post(url, {});
  }

  changePassword(data) {
    const url = `${environment.api_url}user/changePassword`;
    return this.httpClient.post(url, data);
  }

  onSocketToMocha() {
    this.socket.on('ON_RECEIVED_ASSESSMENT_RESULT', (data) => {
      //console.log('ON_RECEIVED_ASSESSMENT_RESULT: ', data);
      this.assessment.next(data.job_seeker_assessments);
    });
  }

  uploadImage(data) {
    const url = `${environment.api_url}uploads`;
    return this.httpClient.post(url, data);
  }
  uploadImageByParams(data, userId) {
    const url = `${environment.api_url}uploads/${userId}`;
    return this.httpClient.post(url, data);
  }

  getReferLink() {
    const url = `${environment.api_url}user/genReferLink`;
    return this.httpClient.get(url)
  }

  notifications_GetList({ page = 0, pageSize = 6, isRead = -1 }) {
    const url = `${environment.api_url}notifications/${isRead}/${page}/${pageSize}`;
    return this.httpClient.get(url)
  }

  notifications_GetTotal() {
    const url = `${environment.api_url}notifications/total`;
    return this.httpClient.get(url)
  }

  notifications_MarkRead(id) {
    const url = `${environment.api_url}notifications/${id}`;
    return this.httpClient.put(url, {})
  }

  signupToReceiveUpdate(body) {
    const url = `${environment.api_url}user/signupToReceiveUpdate`;
    return this.httpClient.post(url, body);
  }

  getCurrentFollower() {
    const url = `${environment.api_url}account-statistics/total`;
    return this.httpClient.get(url)
  }
  getFollowerHistory(fromDate: string, searchValue: number) {
    let url = `${environment.api_url}account-statistics/getFollowerHistory?searchValue=${searchValue}`;
    if (fromDate) {
      url = `${url}&createDateFrom=${fromDate}`;
    }
    return this.httpClient.get(url)
  }
  getRecruitmentFunnel(createDateFrom: string, jobId: number) {
    const obj = {
      createDateFrom,
      jobId
    }
    let url = `${environment.api_url}account-statistics/getRecruitmentFunnel?${this._convertObjectToQuery(obj)}`;
    return this.httpClient.get(url);
  }

  getAllUserStory() {
    const url = `${environment.api_url}user/story`;
    return this.httpClient.get(url);
  }

  getUserStoryByToken(token) {
    const url = `${environment.api_url}user/story/token?token=${token}`;
    return this.httpClient.get(url);
  }

  createUserStory(body) {
    const url = `${environment.api_url}user/story`;
    return this.httpClient.post(url, body);
  }

  uppdateUserStory(id, body) {
    const url = `${environment.api_url}user/story/${id}`;
    return this.httpClient.put(url, body);
  }
  deleteUserStory(id) {
    const url = `${environment.api_url}user/story/${id}`;
    return this.httpClient.delete(url);
  }
}
