import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { HelperService } from 'src/app/services/helper.service';
import { environment } from 'src/environments/environment';
import { Assesment, AssessmentHistory, CustomAssessment } from '../interfaces/assesment';
import { NUMBER_OF_DAY_TO_RETRY_CUSTOM_ASSESSMMENT, TEST_ASSESSMENT_IMOCHA, QESTION_CUSTOME_ASSESSMENT, TOTAL_TASKTEST_CUSTOM_ASSESSMENT } from 'src/app/constants/config';
import { UserInfo } from '../interfaces/userInfo';
import { DataUpdate } from '../interfaces/questionCustomAssessment';
import { MESSAGE } from '../constants/message';
@Injectable({
  providedIn: 'root'
})
export class AssessmentService {

  constructor(
    private httpClient: HttpClient,
    private helperService: HelperService,
  ) { }

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

  getListAssessment(option) {
    const url = `${environment.api_url}assessments/list?${this._convertObjectToQuery(option)}`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      return {
        total: data.total,
        listAssessment: data.results.map(item => this._mapAssessment(item))
      }
    }))
  }
  getListMyAssessment() {
    const url = `${environment.api_url}assessments/list-my-assessment`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      return  data ? data.map(item => this._mapAssessment(item)) : [];
    }))
  }
  getAssessmentsUserStory(params) {
    const url = `${environment.api_url}assessments/user-story?${this._convertObjectToQuery(params)}`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      return data;
    }))
  }

  getMyAssessment(): Observable<Assesment[]> {
    const url = `${environment.api_url}assessments/myAssessment`;
    return this.httpClient.get<Assesment[]>(url).pipe(map(listAssessment => {
      return listAssessment.map(assessment => {
        return this._mapMyAssessmentJobSeeker(assessment);
      })
    }))
  }

  getAssessmentHistory(id): Observable<AssessmentHistory[]> {
    const url = `${environment.api_url}assessments/history/${id}`;
    return this.httpClient.get<Assesment[]>(url).pipe(map(listAssessment => {
      return listAssessment.map(assessment => {
        return this._mapMyAssessmentHistory(assessment);
      })
    }))
  }

  getListMyAssessments() {
    const url = `${environment.api_url}assessments/myAssessment`
    return this.httpClient.get(url).pipe(map((data: any) => {
      return {
        total: data.total,
        listMyAssessment: data.map(item => this._mapMyAssessmentJobSeeker(item))
      }
    }))
  }

  getPreviewAssessmentEmployer(params) {
    const url = `${environment.api_url}assessments/${params.id}/${params.type}/preview`
    return this.httpClient.get(url).pipe(map((data: any) => {
      return data.testPreviewUrl;
    }))
  }

  onCheckLengthSuggestAssessment(listAssessment: Assesment[], category) {
    if (category == 0) return false;
    listAssessment = listAssessment.filter(assessment => assessment.categories.some(item => item.category_id == category));
    return listAssessment.length <= 0;
  }

  addAssessment(assessment_id, assessment_type) {
    const url = `${environment.api_url}assessments/${assessment_id}/${assessment_type}/add`
    return this.httpClient.post(url, null)
  }

  removeAssessment(assessment_id, assessment_type) {
    const url = `${environment.api_url}assessments/${assessment_id}/${assessment_type}/remove`
    return this.httpClient.post(url, null)
  }

  takeAssessment(assessmentInfo: Assesment, jobId = 0, urlHistory = "", isPayment = false) {
    const assessmentId = assessmentInfo.assessmentId ? assessmentInfo.assessmentId : assessmentInfo.assessment_id;
    const url = `${environment.api_url}assessments/${assessmentId}/${assessmentInfo.type}/inviteTest`
    return this.httpClient.post(url, { jobId, redirect_url: urlHistory }).pipe(map((data: any) => {
      return data;
    }));
  }

  submitCustomAssessment(body, assessment_id, assessment_type, assessmentInfo: DataUpdate) {
    const url = `${environment.api_url}assessments/${assessment_id}/${assessment_type}/customs`
    return this.httpClient.put(url, body).pipe(map((data: any) => {
      return data;
    }));
  }

  getListAssessmentEmployer(params): Observable<{ listAssessment: Array<Assesment>, total: number }> {
    const url = `${environment.api_url}assessments/list?${new URLSearchParams(params).toString()}`;
    return this.httpClient.get<Assesment[]>(url).pipe(map((data: any) => {
      return {
        total: data.total,
        listAssessment: data.results.map(item => this._mapAssessmentEmployer(item))
      }
    }))
  }

  checkFreeAttemptsRemaining(user: UserInfo) {
    return user.nbrFreeCredits > 0;
  }

  colorWeightAssessment = (weight) => {
    if (weight === null || weight === undefined || weight === "NAN" || weight === "N/A") {
      return 'skill--dontmake';
    }
    weight = Number.parseInt(weight);
    if (weight >= 80) {
      return 'skill--pass';
    }
    if (weight < 80 && weight >= 65) {
      return 'skill--warning';
    }
    if (weight < 65 && weight >= 0) {
      return 'skill--invalid';
    }
  }

  getListCustomAssessment(params): Observable<{ listCustomAssessment: Array<CustomAssessment>, total: number }> {
    const url = `${environment.api_url}assessments/customs?${new URLSearchParams(params).toString()}`;
    return this.httpClient.get<CustomAssessment[]>(url).pipe(map((data: any) => {
      return {
        total: data.total,
        listCustomAssessment: data.results.map(item => this._mapCustomAssessment(item))
      }
    }))
  }

  getCustomAssessmentDetails(id, type): Observable<DataUpdate> {
    const url = `${environment.api_url}assessments/${id}/${type}`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      return data;
    }))
  }

  createCustomAssessment(data) {
    const url = `${environment.api_url}assessments/customs`;
    return this.httpClient.post(url, data);
  }

  updateCustomAssessment(data, id) {
    const url = `${environment.api_url}assessments/customs/${id}`;
    return this.httpClient.put(url, data);
  }

  deleteCustomAssessment(id) {
    const url = `${environment.api_url}assessments/customs/${id}`;
    return this.httpClient.delete(url);
  }

  convertStringifyData(dataUpdate: DataUpdate) {
    dataUpdate.questionList.map((data, index) => {
      if (data.type == QESTION_CUSTOME_ASSESSMENT.SINGLE_TEXTBOX || data.type == QESTION_CUSTOME_ASSESSMENT.TRUE_FALSE) return;
      let checkAnswer = 0;
      data.full_answers.map(answer => {
        if (answer.is_true == 1) checkAnswer += 1;
      })
      dataUpdate.questionList[index].type = checkAnswer == 1 ? QESTION_CUSTOME_ASSESSMENT.MULTIPLE_CHOICE : QESTION_CUSTOME_ASSESSMENT.CHECKBOXES;
    })
    dataUpdate.questionList.map((question, index) => {
      dataUpdate.questionList[index] = Object.assign({}, question, { full_answers: JSON.stringify(question.full_answers) })
    })
    return dataUpdate;
  }

  private _mapCustomAssessment(data): CustomAssessment {
    return {
      assessment_id: data.assessment_id,
      category_id: data.category_id,
      category_name: data.category_name,
      created_at: data.created_at ? new Date(data.created_at) : null,
      description: data.description,
      duration: data.duration,
      employer_id: data.employer_id,
      id: data.id,
      name: data.name,
      questions: data.questions,
      status: data.status,
      type: data.type,
      updated_at: data.updated_at ? new Date(data.updated_at) : null,
      totalJob: data.total_job ? data.total_job : 0
    } as CustomAssessment;
  }

  private _mapAssessmentEmployer(data): Assesment {
    return {
      id: data.id,
      name: data.name,
      categoryId: data.category_id,
      categoryName: data.category_name,
      description: data.description,
      time: data.duration,
      type: data.type,
      point: data.point,
      assessmentId: data.assessment_id,
      duration: data.duration,
      format: data.format,
      questions: data.questions,
      categories: data.categories
    } as Assesment;
  }

  private _mapMyAssessmentJobSeeker(data): Assesment {
    return {
      id: data.id,
      name: data.assessments_name,
      assessmentId: data.assessment_id,
      categoryName: data.assessments_category_name,
      categoryId: data.assessments_category_id,
      type: data.assessment_type,
      duration: data.assessments_duration,
      assessments_name: data.assessments_name,
      assessments_questions: data.assessments_questions,
      created_at: data.created_at ? new Date(data.created_at) : null,
      current_testInvitationId: data.current_testInvitationId,
      current_testStatus: data.current_testStatus,
      current_testUrl: data.current_testUrl,
      is_deleted: data.is_deleted,
      job_seeker_id: data.job_seeker_id,
      status: data.status,
      totalTake: data.totalTake,
      updated_at: data.updated_at ? new Date(data.updated_at) : null,
      weight: data.weight,
      description: data.assessments_description,
      job_seeker_assessments_current_testStatus: data.job_seeker_assessments_current_testStatus,
      questions: data.questions,
      selectedShowHistory: false,
      instruction: data?.instruction || ''
    } as Assesment;
  }

  private _mapMyAssessmentHistory(data): AssessmentHistory {
    return {
      attemptedOnUtc: data.AttemptedOnUtc ? data.AttemptedOnUtc : null,
      status: data.Status,
      assessmentId: data.assessment_id,
      weight: data.weight
    } as AssessmentHistory;
  }

  private _mapAssessment(data) {
    return {
      id: data.id,
      name: data.name,
      duration: data.duration,
      assessment_id: data.assessment_id,
      category_id: data.category_id,
      category_name: data.category_name,
      job_seeker_assessments_current_testStatus: data.job_seeker_assessments_current_testStatus,
      created_at: data.created_at,
      description: data.description,
      job_seeker_assessments_status: data.job_seeker_assessments_status,
      job_seeker_assessments_time: data.job_seeker_assessments_time ? new Date(data.job_seeker_assessments_time) : null,
      weight: data.job_seeker_assessments_weight,
      totalTake: data.job_seeker_assessments_totalTake,
      status: data.status,
      time_limit: data.time_limit,
      type: data.type,
      updated_at: data.updated_at ? new Date(data.updated_at) : null,
      questions: data.questions,
      format: data.format,
      selectedShowHistory: false,
      categories: data.categories,
      instruction: data?.instruction || ''
    };
  }

  checkRetryCustomAssessment(assessment: Assesment) {
    if (assessment.totalTake >= TOTAL_TASKTEST_CUSTOM_ASSESSMENT.DO_THIRD_TIME) return true;
    
    if (assessment.totalTake == TOTAL_TASKTEST_CUSTOM_ASSESSMENT.DO_FIRST_TIME ||
      assessment.totalTake == TOTAL_TASKTEST_CUSTOM_ASSESSMENT.DO_SECOND_TIME) {
      if (this.dateDiff(assessment.job_seeker_assessments_time, new Date()) < NUMBER_OF_DAY_TO_RETRY_CUSTOM_ASSESSMMENT) return false;
    }
    return true;
  }

  dateDiff(first, second) {
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
  }

  messageTestAssessmentJobseeker(nbrFree: number, nbr: number): number{
    if(nbrFree > 0) return TEST_ASSESSMENT_IMOCHA.NBR_FREE;
    if(nbr > 0){
      return TEST_ASSESSMENT_IMOCHA.NBR_AVAIL
    }
    return TEST_ASSESSMENT_IMOCHA.NBR_UNAVAIL;
  }

}
