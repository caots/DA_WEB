import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { omit } from 'lodash';

import { Item } from 'src/app/interfaces/item';
import { Assesment } from 'src/app/interfaces/assesment';
import { environment } from 'src/environments/environment';
import { Applicants } from 'src/app/interfaces/applicants';
import { APPLICANT_STAGE, ORDER_APPLICANTS, TRACKING_RECRUITMENT_TYPE } from 'src/app/constants/config';
@Injectable({
  providedIn: 'root'
})

export class ApplicantsService {

  constructor(
    private httpClient: HttpClient,
  ) {

  }

  getListApplicants(option): Observable<{ listApplicants: Array<Applicants>, total: number }> {
    const url = `${environment.api_url}applicants?${this._convertObjectToQuery(option)}`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      return {
        total: data.total,
        listApplicants: data.results.map(item => this._mapApplicants(item))
      }
    }))
  }

  getListApplicantsByJobseeker(jobId): Observable<{ listApplicants: Array<Applicants>, total: number }> {
    let options ={
      page: 0,
      pageSize: 1,
      jobId: jobId
    }
    const url = `${environment.api_url}applicants/byJobseeker?${this._convertObjectToQuery(options)}`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      return {
        total: data.total,
        listApplicants: data.results.map(item => this._mapApplicants(item))
      }
    }))
  }

  private _convertObjectToQuery(obj) {
    let query = '';
    const objIgnoreQ = omit(obj, ['q']) as any;
    for (let key in objIgnoreQ) {
      if (obj[key] !== undefined) {
        // if (key == 'q') {
        //   obj[key] = encodeURIComponent(obj[key]);
        // }
        if (query) {
          query += `&${key}=${obj[key]}`;
        } else {
          query += `${key}=${obj[key]}`;
        }
      }
    }
    if (obj.q !== undefined) {
      if (query) {
        query += `&q=${obj.q}`;
      } else {
        query += `q=${obj.q}`;
      }
    }
    return query;
  }

  bookMark(id, data) {
    const url = `${environment.api_url}applicants/${id}/bookmark`;
    return this.httpClient.put(url, data);
  }

  makeToViewProfile(id, data) {
    const url = `${environment.api_url}/applicants/${id}/makeToViewProfile`;
    return this.httpClient.put(url, data);
  }
  requestUnmask(id) {
    const url = `${environment.api_url}applicants/${id}/requestUnmask`;
    return this.httpClient.put(url, null);
  }
  addNote(id, data: any, jobId: number, companyId: number) {
    const url = `${environment.api_url}applicants/${id}/note`;
    return this.httpClient.post(url, data).pipe(res => {
      const offerState = APPLICANT_STAGE.find(x=>x.id == 5);
      const hireState = APPLICANT_STAGE.find(x=>x.id == 7);
      if (data.stage == offerState.id || data.stage == hireState.id) {
        const logObj = {
          employer_id: companyId,
          job_id: jobId,
          type: data.stage == offerState.id ? TRACKING_RECRUITMENT_TYPE[5].id : TRACKING_RECRUITMENT_TYPE[6].id
        }
      }
      return res;
    });
  }
  updateCanRateStars(id: number): Observable<any> {
    const url = `${environment.api_url}applicants/${id}/makeCanRateStars`;
    return this.httpClient.put(url, {});
  }

  updateViewApplicant(id: number, body): Observable<any> {
    const url = `${environment.api_url}applicants/${id}/makeToViewProfileByEmployer`;
    return this.httpClient.put(url, body);
  }

  getListSortApplicants(): Array<Item> {
    return [
      { id: ORDER_APPLICANTS.SCORE_DESC, name: 'Highest Overall Weighted Score' },
      { id: ORDER_APPLICANTS.SCORE_ASC, name: 'Lowest Overall Weighted Score' },
      { id: ORDER_APPLICANTS.HIGHEST_RATING, name: 'Highest Rating' },
      { id: ORDER_APPLICANTS.LOWEST_RATING, name: 'Lowest Rating' },
    ]
  }

  updateRating(id, data){
    const url = `${environment.api_url}applicants/${id}/ratting`;
    return this.httpClient.put(url, data);
  }

  private _mapJobAssessment(data): Assesment {
    return {
      id: data.jobs_id,
      name: data.name,
      point: data.job_assessments_point
    } as Assesment;
  }

  private _mapApplicants(data): Applicants {
    return {
      userId: data.id,
      jobId: data.job_id,
      firstName: data.job_seeker_first_name,
      lastName: data.job_seeker_last_name,
      picture: `${data.job_seeker_profile_picture}`,
      note: data.note,
      stateName: data.state_name,
      title: data.title,
      status: data.status,
      expiredAt: data.expired_at ? new Date(data.expired_at) : null,
      cityName: data.city_name,
      group_id: data.group_id,
      // listAssessment: data.job_assessments.map(assessment => this._mapJobAssessment(assessment)),
      listAssessment: data.job_assessments,
      totalPoint: data.total_point,
      bookmarked: data.bookmarked,
      salary: data.asking_salary,
      salaryType: data.asking_salary_type,
      benefits: data.asking_benefits,
      assessmentsResult: JSON.parse(data.assessments_result),
      jobSeekerRate: data.job_seeker_rate,
      jobseekerId: data.job_sekker_id,
      stage: data.stage,
      can_view_profile: data.can_view_profile,
      scheduleTime: data.scheduleTime ? new Date(data.scheduleTime) : null,
      canViewProfile: data.can_view_profile,
      canRateStars: data.can_rate_stars,
      jobIsPrivate: data.job_is_private ? data.job_is_private : 0,
      type: data.type,
      job_seeker_user_responsive: data.job_seeker_user_responsive || 0,
      jobseeker_is_deleted: data.jobseeker_is_deleted || 0,
      jobseeker_user_status: data.jobseeker_user_status || 0,
      jobseeker_is_user_deleted: data.jobseeker_is_user_deleted || 0,
    } as Applicants;
  }
}

