import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StorageService } from 'src/app/services/storage.service';
import { SubjectService } from 'src/app/services/subject.service';
import { Candidate } from 'src/app/interfaces/candidate';

@Injectable({
  providedIn: 'root'
})

export class CandidateService {
  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    private subjectService: SubjectService,
  ) { }


  getListCandidate(condition) {
    const url = `${environment.api_url}find-candidate?${this._convertObjectToQuery(condition)}`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      return {
        total: data.total,
        listCandidate: data.results
      }
    }))
  }

  getHistoryAssessmentCandidate(condition) {
    const url = `${environment.api_url}find-candidate/getAssessments?${this._convertObjectToQuery(condition)}`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      return {
        total: data.total,
        listCandidateHistory: data.results
      }
    }))
  }

  getListJobToInvite(condition) {
    const url = `${environment.api_url}find-candidate/getJobToInvite?${this._convertObjectToQuery(condition)}`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      return {
        total: data.total,
        listJobInvite: data.results
      }
    }))
  }

  bookMark(id, data) {
    const url = `${environment.api_url}find-candidate/bookmark/${id}`;
    return this.httpClient.post(url, data);
  }

  createGroupChat(candidate: Candidate) {
    const url = `${environment.api_url}find-candidate/createGroupChat`;
    return this.httpClient.post(url, { jobseekerId: candidate.id });
  }

  inviteJob(data) {
    const url = `${environment.api_url}find-candidate/invited`;
    return this.httpClient.post(url, data);
  }

  _convertObjectToQuery(obj) {
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

}