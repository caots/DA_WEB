import { CHAT_GROUP_STATUS, GROUP_NOMAL_TYPE, NOTIFICATION_STATUS, PAGING } from './../constants/config';
import { get } from 'lodash';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { omit } from 'lodash';
import { Notification } from 'src/app/interfaces/notification';
import { saveAs } from 'file-saver';

import { environment } from 'src/environments/environment';
import { SubjectService } from './subject.service';
import { UserService } from './user.service';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { HelperService } from './helper.service';
import { PreviousRouteService } from './previous-route.service';
import { Router } from '@angular/router';
import { USER_TYPE, CHAT_CONTENT_TYPE } from '../constants/config';
import { Conversation, Message, SocketMessage, FileDrop } from '../interfaces/message';
import { Applicants } from '../interfaces/applicants';
import { FileService } from 'src/app/services/file.service';
import { Candidate } from '../interfaces/candidate';
import { NotificationService } from './notification.service';
const config: SocketIoConfig = {
  url: `${environment.host}`, options: {
    withCredentials: true,
    // transports: ['websocket']
  }
};
@Injectable({
  providedIn: 'root'
})
export class MessageService {
  subscription: Subscription = new Subscription();
  Unread = new BehaviorSubject<number>(null);
  receivedMessageSubject = new BehaviorSubject<SocketMessage>(null);
  seenMessageSubject = new BehaviorSubject<SocketMessage>(null);
  sentMessageSubject = new BehaviorSubject<SocketMessage>(null);
  sentSuccesssMessageSubject = new BehaviorSubject<SocketMessage>(null);
  receivedRequestUnmarkUpdate = new BehaviorSubject<any>(null);
  user: UserInfo;
  params: any;
  constructor(
    private httpClient: HttpClient,
    private socket: Socket,
    private subjectService: SubjectService,
    private userService: UserService,
    private helperService: HelperService,
    private previousRouteService: PreviousRouteService,
    private notificationService: NotificationService,
    private router: Router,
    private fileService: FileService
  ) {
    this.subjectService.user.subscribe(data => {
      this.user = data;
    });
    this.params = {
      is_read: NOTIFICATION_STATUS.ALL,
      page: 0,
      pageSize: PAGING.MAX_ITEM_NOTIFICATION
    }
  }
  connectSocket(user) {
    //console.log(user);
    if (!user) { return; }
    this.socket = new Socket(config);
    this.socket.connect();
    this.socket.emit('JOIN_ALL_ZOOM', user && user.id);
    this.handleOnSocketSubscription(user);
  }


  handleOnSocketSubscription(user: UserInfo) {
    // on received message
    const handleEventListenReceiveMessage = this.handleEventListenReceiveMessage().subscribe((msg: SocketMessage) => {
      if (!msg) { return; }
      const senderId = get(msg, 'current_user.id', -1);
      if (this.user.id == senderId && this.user.id != msg.updated_user_id) {
        //console.log('receivedMessageSubject');
        this.receivedMessageSubject.next(msg);
      }
    });
    this.subscription.add(handleEventListenReceiveMessage);

    // on seen message
    const handleEventListenSeenMessage = this.handleEventListenSeenMessage().subscribe((msg: SocketMessage) => {
      if (!msg) { return; }
      const senderId = get(msg, 'current_user.id', -1);
      if (this.user.id == senderId && this.user.id != msg.updated_user_id) {
        this.seenMessageSubject.next(msg);
        //console.log('seenMessageSubject');
        this.getCountMessageUnread().subscribe();
      }
    });

    this.subscription.add(handleEventListenSeenMessage);

    // on send message
    const handleEventListenMessage = this.handleEventListenMessage().subscribe((msg: SocketMessage) => {
      //console.log(msg);
      if (!msg) { return; }
      const senderId = get(msg, 'current_user.id', -1);
      if (this.user.id == senderId) {
        //console.log('sentSuccesssMessageSubject');
        this.sentSuccesssMessageSubject.next(msg);
      } else {
        //console.log('sentMessageSubject');
        this.sentMessageSubject.next(msg);
        // check to show toast
        const currentUrl = this.previousRouteService.getCurrentUrl();
        if (currentUrl.includes(`/messages`) || currentUrl.includes(`/employer-messages`)) {
          return;
        }
        this.getCountMessageUnread().subscribe();
        this.helperService.showToastToNewMessage('', 'Received a new message', msg, this.user);
        this.playAudio();
      }
    });
    this.subscription.add(handleEventListenMessage);

  }
  playAudio() {
    const audio = new Audio();
    audio.src = 'assets/audio/sound_chat.mp3';
    audio.load();
    audio.play();
  }
  joinToGroup(groupId: number) {
    if (!groupId) { return; }
    this.socket.emit('JOIN_ZOOM', groupId);
  }
  
  disconnect() {
    this.subscription.unsubscribe();
    this.subscription = new Subscription();
    this.socket.disconnect();
  }
  public convertObjectToQuery(obj) {
    let query = '';
    const objIgnoreQ = omit(obj, ['q']) as any;
    for (const key in objIgnoreQ) {
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

  SendMessage(socketMessage: SocketMessage) {
    // //console.log(dataMessage)
    this.socket.emit('send_message', socketMessage);
  }
  handleEventInviteJoinZoom() {
    return this.socket
      .fromEvent('ON_RECEIVED_INVITE_JOIN_ZOOM')
      .pipe(map((data) => data));
  }
  handleEventListenMessage() {
    return this.socket
      .fromEvent('send_message_to_client')
      .pipe(map((data) => data));
  }

  handleEventListenSeenMessage() {
    //console.log('aaaa');
    return this.socket
      .fromEvent('seen_message_to_client')
      .pipe(map((data) => data));
    // this.socket.on('seen_message_to_client', (data) => {
    //   //console.log('seen_message_to_client: ', data);
    // });
  }

  handleEventEmitSeenMessage(data) {
    data.updated_user_id = this.user.id;
    this.socket.emit('seen_message', data);
  }
  handleEventEmitSeenMessageWhenGetList(group_id, user_id, user_avatar, user_name, content_type, message, acc_type, company_name, employer_title, employer_id, updated_user_id, message_id) {
    const dataMessage = {
      group_id,
      current_user: {
        id: user_id,
        avatar: user_avatar,
        full_name: user_name,
        acc_type,
        company_name,
        employer_title,
        employer_id
      },
      content: message,
      mime_type: '',
      content_type,
      updated_user_id,
      message_id,
      isReadAll: true
    };
    //console.log(dataMessage);
    this.socket.emit('seen_message', dataMessage);
    this.getCountMessageUnread().subscribe();
  }
  handleEventListenReceiveMessage() {
    return this.socket
      .fromEvent('received_message_to_client')
      .pipe(map((data) => data));
    // this.socket.on('received_message_to_client', (data) => {
    //   //console.log('received_message_to_client: ', data);
    // });
  }

  handleEventEmitReceiveMessage(data) {
    data.updated_user_id = this.user.id;
    this.socket.emit('received_message', data);
  }
  updateLastMessageToListConversation(messageDB: Message, socketMesage: SocketMessage,
    dataConversation: Conversation[], supportConver: Conversation) {
    if ((!messageDB && !socketMesage) || !dataConversation || dataConversation.length == 0) { return; }
    const groupId = messageDB && messageDB.group_id ? messageDB.group_id : socketMesage.group_id;
    let conversation = dataConversation.find(msg => msg.group_id == groupId);
    if (!conversation) {
      if (!supportConver || supportConver.group_id != groupId) {
        return;
      }
      conversation = supportConver;
    }
    if (messageDB) {
      conversation.msg_id = messageDB.id;
      conversation.msg_sender_id = messageDB.user_id;
      conversation.msg_sender_first_name = messageDB.user_first_name;
      conversation.msg_content = messageDB.content;
      conversation.msg_content_type = messageDB.content_type;
      conversation.msg_content_html = messageDB.content_html;
      conversation.read_message_id = messageDB.id;
      conversation.msg_mime_type = messageDB.mime_type;
    } else {
      conversation.msg_id = socketMesage.message_id;
      conversation.msg_sender_id = socketMesage.current_user.id;
      conversation.msg_sender_first_name = socketMesage.current_user.first_name;
      conversation.msg_content = socketMesage.content;
      conversation.msg_content_type = socketMesage.content_type;
      conversation.msg_content_html = socketMesage.content_html;
      conversation.msg_mime_type = socketMesage.mime_type;
    }
  }
  sendRequestUnmark(data) {
    data.updated_user_id = this.user.id;
    this.socket.emit('request_unmark', data);
  }
  handleEventRequestUnmarkUpdate() {
    return this.socket
      .fromEvent('request_unmark_update')
      .pipe(map((data) => data));
  }

  sendJoinToGroup(applicant: Applicants) {
    const data = {
      group_id: applicant.group_id,
      user_id: this.user.id
    };
    this.socket.emit('join_group', data);
  }

  redirectToMessageCenter(applicant: Applicants) {
    if (!this.user) { return; }
    if (this.user.acc_type == USER_TYPE.EMPLOYER && this.user.employer_id > 0) {
      this.sendJoinToGroup(applicant);
    }
    this.router.navigate(['/employer-messages'], {
      queryParams: {
        groupId: applicant.group_id,
        searchType: `${CHAT_GROUP_STATUS.All}`,
        isGroup: '1',
        q: applicant.title
      }
    });
  }

  redirectToDSCandidateCenter(candidate: Candidate) {
    if (!this.user) { return; }
    if (this.user.acc_type == USER_TYPE.EMPLOYER && this.user.employer_id > 0) {
      this.sendJoinToGroupCandidate(candidate);
    }
    this.router.navigate(['/employer-messages'], {
      queryParams: {
        groupId: candidate.chat_group_id,
        searchType: `${CHAT_GROUP_STATUS.All}`,
        isGroup: '1',
        // q: candidate.first_name
      }
    });
  }

  sendJoinToGroupCandidate(candidate: Candidate) {
    const data = {
      group_id: candidate.chat_group_id,
      user_id: this.user.id
    };
    this.socket.emit('join_group', data);
  }

  // ==================== end socket =====================
  uploadImage(file) {
    const url = `${environment.api_url}uploads`;
    return this.httpClient.post(url, file);
  }

  getListConversation(option) {
    const url = `${environment.api_url}chats/list?${this.convertObjectToQuery(option)}`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      return {
        total: data.total,
        listConversation: data.results.map(item => this._mapConversation(item))
      };
    }));
  }

  getConversationDetail(option, ConversationId) {
    const url = `${environment.api_url}chats/${ConversationId}?${this.convertObjectToQuery(option)}`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      return {
        total: data.messages.total,
        groupInfo: data.groupInfo,
        listMessage: data.messages.results.map(item => this._mapMessage(item))
      };
    }));
  }

  getListUploadData(id, contentType) {
    const url = `${environment.api_url}chats/${id}/${contentType}`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      return {
        total: data.total,
        results: data.results,
      };
    }));
  }

  getCountMessageUnread() {
    const url = `${environment.api_url}chats`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      this.Unread.next(data.unread);
    }));
  }

  rateBot(userId, vote, group_nomal_type = GROUP_NOMAL_TYPE.Nomal) {
    const body = {
      user_id: userId,
      is_responsive: vote,
      group_nomal_type
    };
    const url = `${environment.api_url}user/voteResponsive`;
    return this.httpClient.post(url, body);
  }

  inviteUser(id, memberId, status) {
    const url = `${environment.api_url}chats/${id}/${memberId}`;
    return this.httpClient.post(url, { status });
  }

  getVoteResponsive(userId, groupNomalType = GROUP_NOMAL_TYPE.Nomal) {
    const url = `${environment.api_url}user/voteResponsive?user_id=${userId}&group_nomal_type=${groupNomalType}`;
    return this.httpClient.get(url);
  }

  getListUserCanInvite(id) {
    //console.log('aaaa');
    const url = `${environment.api_url}employers?groupId=${id}`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      //console.log(data);
      return {
        total: data.total,
        results: data.results,
      };
    }));
  }

  reportUser(data) {
    const url = `${environment.api_url}chats/report`;
    return this.httpClient.put(url, data);
  }

  checkIsUrl(url: string) {
    const regex = new RegExp('^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?');
    return regex.test(url);
  }

  genUrl(content: string, isDropFileMessage: boolean = false) {
    try {
      if (!content && isDropFileMessage) {
        return 'assets/images/picture-message.png';
      }
      if (this.checkIsUrl(content)) {
        return content;
      }
      // // const url = `${content}`;
      // if (this.checkIsUrl(url)) {
      //   return url;
      // }
      return content;
    } catch (e) {
      console.error(e);
      // return “assets/images/no-avatar.png”;
    }
  }

  isUnreadMessage(conversation: Conversation): Boolean {
    if (!conversation || !conversation.msg_id) {
      return false;
    }
    if (!this.user || conversation.msg_sender_id == this.user.id) {
      return false;
    }
    if (
      conversation.read_message_id &&
      conversation.read_message_id >= conversation.msg_id
    ) {
      return false;
    }
    return true;
  }

  private _mapConversation(data) {
    return {
      ...data,
      job_seeker_rate: data.job_seeker_rate ? Number(data.job_seeker_rate.toFixed(0)) : -1
    };
  }

  private _mapMessage(data) {
    return data;
  }

  downloadHistoryChat(id) {
    const url = `${environment.api_url}chats/history/${id}`;
    return this.httpClient.get(url).subscribe((res: any) => {
      return this.downloadURI(`${res.filePath}`);
    });
  }

  downloadScheduleTimeICS(body) {
    const url = `${environment.api_url}chats//download-interview-infomation`;
    return this.httpClient.post(url, body).pipe(map((res: any) => {
      var blob = new Blob([res.data], { type: "text/calendar;charset=utf-8" });
      saveAs(blob, res.title);
    }));
  }

  downloadURI(uri) {
    let link = document.createElement('a');
    link.href = uri;
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
  }

  genMessageWithFile(messageContent: string, file: FileDrop) {
    messageContent = messageContent?.trim().replace(/\n/g, '<br/>');
    // const nameWithoutTimestamp = this.fileService.convertNameOfFile(file.name);
    // `<ms-preview-file [url]="${url}" [message]="${messsage}"></ms-preview-file>`;
    // `<a href="${url}" class="file-preview">
    //     <span class="file-name">${nameWithoutTimestamp}</span>
    //   </a>`
    // const fileElement = file.type === CHAT_CONTENT_TYPE.Image ?
    //   `<a class="image-html">
    //     <img src="${url}" />
    //   </a>` :
    //   `<a class="file-preview" shareButtonDir>
    //     <p class="file-url-hide">${url}</p>
    //     <span class="file-name" shareButtonDir>${nameWithoutTimestamp}</span>
    //   </a>`;
    // return `
    //   ${messageContent ? `<p class="my-message-text">${messageContent}</p>` : ''}
    //   ${fileElement}
    // `;
    return `${messageContent ? `<p class="my-message-text">${messageContent}</p>` : ''}`;
  }
  updateGroup(id: number, status = CHAT_GROUP_STATUS.Archived, jobId = 0, isAll = 0) {
    const url = `${environment.api_url}chats/${id}/${status}`;
    return this.httpClient.put(url, { jobId, isAll }).pipe(map((data: any) => {
      return data;
    }));
  }
  getPotentialCandidate(id) {
    const url = `${environment.api_url}/find-candidate?jobseekerId=${id}`;
    return this.httpClient.get(url);
  }
  getAssessmentCandidateOfJobseeker(jobseekerId) {
    const url = `${environment.api_url}/find-candidate/getAssessments?jobseekerId=${jobseekerId}`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      return data;
    }));
  }
  requestUnmaskPotential(jobseekerId) {
    const url = `${environment.api_url}/find-candidate/requestUnmask/${jobseekerId}`;
    return this.httpClient.post(url, {}).pipe(map((data: any) => {
      return data;
    }));
  }
}
