import { get } from 'lodash';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { omit } from 'lodash';

import { environment } from 'src/environments/environment';
import { SubjectService } from './subject.service';
import { UserService } from './user.service';
import { Notification } from 'src/app/interfaces/notification';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { HelperService } from './helper.service';
import { PreviousRouteService } from './previous-route.service';
import { Router } from '@angular/router';

const config: SocketIoConfig = {
  url: `${environment.host}`, options: {
    withCredentials: true,
    // transports: ['websocket']
  }
};

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  subscription: Subscription = new Subscription();
  Unread = new BehaviorSubject<number>(null);
  user: UserInfo;

  constructor(
    private httpClient: HttpClient,
    private socket: Socket,
    private subjectService: SubjectService,
    private userService: UserService,
    private helperService: HelperService,
    private previousRouteService: PreviousRouteService,
    private router: Router,
  ) {
    this.subjectService.user.subscribe(data => {
      this.user = data;
    });
  }

  markReadNotification(id) {
    const url = `${environment.api_url}notifications/${id}`;
    return this.httpClient.put(url, '');
  }

  markReadMultiNotification(ids) {
    const url = `${environment.api_url}notifications/${ids}`;
    return this.httpClient.put(url, '');
  }

  getTotalNotification() {
    const url = `${environment.api_url}notifications/total`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      const unRead = get(data, 'total.0.0.total_unread', 0);
      this.subjectService.unReadNotification.next(unRead);
      return data.total;
    }));
  }
  
  getListNotification(params): Observable<{ listNoti: Array<Notification>, total: number }>  {
    const url = `${environment.api_url}notifications/${params?.is_read}/${params?.page}/${params?.pageSize}`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      return {
        listNoti: data.results,
        total: data.total
      }
    }));
  }

  checkClickApplyJob(jobId){
    const url = `${environment.api_url}notifications/clickApplyJob/${jobId}`;
    return this.httpClient.get(url);
  }

}