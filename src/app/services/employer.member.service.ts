import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Item } from 'src/app/interfaces/item';
import { Assesment } from 'src/app/interfaces/assesment';
import { environment } from 'src/environments/environment';
import { EmployerMember } from 'src/app/interfaces/employerMember';
import { ORDER_APPLICANTS } from 'src/app/constants/config';

@Injectable({
  providedIn: 'root'
})
export class EmployerMemberService {

  constructor(
    private httpClient: HttpClient,
  ) { }


  inviteMember(member) {
    const url = `${environment.api_url}employers`;
    return this.httpClient.post(url, member);
  }

  updateMember(member, id) {
    //console.log(id);
    const url = `${environment.api_url}employers/${id}`;
    return this.httpClient.put(url, member);
  }

  deleteMember(id) {
    const url = `${environment.api_url}employers/deleteMember/${id}`;
    return this.httpClient.get(url);
  }

  sendMailMember(id) {
    const url = `${environment.api_url}employers/resetPasswordMember/${id}`;
    return this.httpClient.get(url);
  }


  getListMember(option): Observable<{ listEmployer: Array<EmployerMember>, total: number }> {
    const url = `${environment.api_url}employers?${this._convertObjectToQuery(option)}`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      return {
        total: data.total,
        listEmployer: data.results.map(item => this._mapEmployer(item))
      }
    }))
  }

  private _mapEmployer(data): EmployerMember {
    return {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,

      employerTitle: data.employer_title,
      employerID: data.employer_id,
      emailVerified: data.email_verified,
      status: data.status,
      profilePicture: data.profile_picture,
      createAt: data.created_at,
      updateAt: data.updated_at,
      isDeleted: data.is_deleted,
      isUserDeleted: data.is_user_deleted,
      permission: this._mapPermission(data.permissions),
    } as EmployerMember;
  }

  private _mapPermission(data) {
    let listPermission = this.getListPermission();
    data.forEach((element, index) => {
      let i = element - 1;
      const idx = listPermission.findIndex(per => per.id === element);
      if(idx < 0) return;
      listPermission[idx].checked = true;
    });
    return {
      listPermission
    }
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

  getListPermission() {
    return [
      {
        id: 1,
        name: 'Create and manage job posts.',
        checked: false,
      },
      {
        id: 3,
        name: 'Message Jobseekers who have applied to a job post',
        checked: false,
      },
      {
        id: 2,
        name: 'Edit company profile information.',
        checked: false,
      }
    ]
  }

}


