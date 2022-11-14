import { FileService } from 'src/app/services/file.service';
import { Conversation, FileDrop, GroupInfo, SocketMessage } from './../../../interfaces/message';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { HelperService } from 'src/app/services/helper.service';
import { PaginationConfig } from 'src/app/interfaces/paginattionConfig';
import { MessageService } from 'src/app/services/message.service';
import { Message } from 'src/app/interfaces/message';
import { environment } from 'src/environments/environment';
import { SubjectService } from 'src/app/services/subject.service';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { ApplicantsService } from 'src/app/services/applicants.service';
import { MAX_SIZE_IMAGE_UPLOAD, USER_STATUS, CHAT_CONTENT_TYPE, listFileAcceptMessage, listImageAcceptMessage, GROUP_TYPE, USER_TYPE, GROUP_NOMAL_TYPE, TRACKING_RECRUITMENT_TYPE } from 'src/app/constants/config';
import { SearchConversation } from 'src/app/interfaces/search';
import { JobService } from 'src/app/services/job.service';
import { PreviousRouteService } from 'src/app/services/previous-route.service';
import { Subscription } from 'rxjs';
import { get } from 'lodash';
import { MESSAGE } from 'src/app/constants/message';
import { PermissionService } from 'src/app/services/permission.service';
import { UserService } from '../../../services/user.service';
import { ModalViewImageComponent } from 'src/app/components/modal-view-image/modal-view-image.component';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'ms-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class MessagesComponent implements OnInit {
  subscription: Subscription = new Subscription();
  @ViewChild('scrollChat') myScrollContainer: ElementRef;
  paginationConversationConfig: PaginationConfig;
  paginationMessageConfig: PaginationConfig;
  querySearch: SearchConversation;
  isSearching: boolean;
  isLoadingListConversation: boolean;
  dataConversation: Conversation[];
  isLoadingConversationDetail = true;
  listMessages: Message[] = [];
  boxInfo: boolean;
  user: UserInfo;
  ApplicantInfo: any;
  listApplicants: any;
  avtFile: Array<any> = [];
  message: any;
  avtBase64: Array<any> = [];
  imageChangedEvent: any;
  selectedFiles: any;
  isMaxSizeImage: boolean;
  listMessage: Message[] = [];
  groupInfo: GroupInfo;
  groupId: number;
  voteResponsive: any;
  isCheckGetVote = false;
  stage: any;
  GROUP_TYPE = GROUP_TYPE;
  USER_TYPE = USER_TYPE;
  CHAT_CONTENT_TYPE = CHAT_CONTENT_TYPE;
  currentCompany: any;
  currentLogoCompany: string;
  totalemployerMsg: number;
  modalReportEmployerRef: NgbModalRef;
  fileDrop: FileDrop = null;
  isUploading = false;
  supportConversation: Conversation;
  colLeftInMobile = true;
  collapses = [];
  isViewMoreConversation: boolean;
  totalJobseekerMsg: number;
  USER_STATUS = USER_STATUS;
  previousUrl: string;
  API_S3 = environment.api_s3;

  constructor(
    private helperService: HelperService,
    public messageService: MessageService,
    private subjectService: SubjectService,
    private applicantsService: ApplicantsService,
    private modalService: NgbModal,
    private jobService: JobService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private previousRouteService: PreviousRouteService,
    public permissionService: PermissionService,
    public breakpointObserver: BreakpointObserver,
    private userService: UserService,
    public fileService: FileService,
    public imageService: ImageService,
  ) { }
  ngOnInit(): void {
    this.boxInfo = false;
    this.messageService.getCountMessageUnread().subscribe();
    this.subjectService.user.subscribe(user => {
      this.user = user;
    });
    this.subjectService.previousUrlMessage.subscribe(data => {
      this.previousUrl = data;
    })
    this.paginationMessageConfig = {
      currentPage: 0,
      totalRecord: 0,
      maxRecord: 20
    };
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.querySearch = new SearchConversation();
      this.paginationConversationConfig = {
        currentPage: 0,
        totalRecord: 0,
        maxRecord: 20
      };
      this.querySearch.searchType = params.searchType;
      if (params.q) {
        this.querySearch.q = params.q;
      }
      if (params.groupId) {
        this.groupId = params.groupId;
        this.querySearch.groupId = params.groupId;
        this.getListConversationDetail(this.groupId, true);
      }
    });
    this.getConversationSupportDetail();
    this.getListConversation();
    this.handleOnMessageSubscription();
  }
  handleOnMessageSubscription() {
    this.handleEventListenReceiveMessage();
    this.handleEventListenMessage();
    this.handleEventSentSuccesssMessageSubject();
    this.handleEventListenSeenMessage();
  }
  handleEventListenReceiveMessage() {
    const handleEventListenReceiveMessage = this.messageService.receivedMessageSubject.subscribe((msg: any) => {
      if (!msg) { return; }
      const senderId = get(msg, 'current_user.id', -1);
      const message = this.listMessages.find(m => (
        m.id == msg.message_id && this.user.id == senderId
        && this.user.id != msg.updated_user_id));
      if (!message) { return; }
      message.isRead = 'Received';
    });
    this.subscription.add(handleEventListenReceiveMessage);
  }
  handleEventListenSeenMessage() {
    const handleEventListenSeenMessage = this.messageService.seenMessageSubject.subscribe((msg: any) => {
      if (!msg) { return; }
      const senderId = get(msg, 'current_user.id', -1);
      const message = this.listMessages.find(m =>
        this.groupInfo?.id == msg.group_id && m.id == msg.message_id
        && this.user.id == senderId && this.user.id != msg.updated_user_id
      );
      if (!message) { return; }
      message.isRead = 'Seen';
      if (msg.isReadAll) {
        this.listMessages.forEach(m => {
          if (m.isRead && m.isRead != 'Seen') {
            m.isRead = 'Seen';
          }
        });
      }
    });
    this.subscription.add(handleEventListenSeenMessage);
  }
  handleEventListenMessage() {
    const handleEventListenMessage = this.messageService.sentMessageSubject.subscribe((res: any) => {
      if (!this.groupInfo || !this.groupInfo.id) {
        return;
      }
      if (this.groupInfo.id == res.group_id) {
        const msg = {
          content: res.content,
          content_html: res.content_html,
          content_type: res.content_type,
          user_id: res.current_user.id,
          user_first_name: res.current_user.first_name,
          user_last_name: res.current_user.last_name,
          user_acc_type: res.current_user.acc_type,
          user_company_name: res.current_user.company_name,
          user_employer_id: res.current_user.employer_id,
          user_employer_title: res.current_user.employer_title,
          user_profile_picture: res.current_user.avatar,
          group_id: res.group_id,
          id: res.message_id,
          mime_type: res.mime_type,
          isRead: ''
        } as Message;
        this.listMessages.push(msg);
        this.messageService.handleEventEmitSeenMessage(res);
        this.scrollToBottom();
        this.imageService.addEventClickViewImage();
        if (msg.user_acc_type == USER_TYPE.EMPLOYER) {
          this.totalemployerMsg = this.totalemployerMsg + 1;
        }
        this.addMsgToListMedia(msg);
      } else {
        this.messageService.handleEventEmitReceiveMessage(res);
        this.messageService.updateLastMessageToListConversation(null, res, this.dataConversation, this.supportConversation);
      }
    });
    this.subscription.add(handleEventListenMessage);
  }
  handleEventSentSuccesssMessageSubject() {
    const handleEventSentSuccesssMessageSubject = this.messageService.sentSuccesssMessageSubject.subscribe((res: any) => {
      if (!this.groupInfo || !this.groupInfo.id || this.groupInfo.id != res.group_id) {
        return;
      }
      const msg = {
        content: res.content,
        content_type: res.content_type,
        content_html: res.content_html,
        user_id: res.current_user.id,
        user_first_name: res.current_user.full_name,
        group_id: res.group_id,
        id: res.message_id,
        mime_type: res.mime_type,
        isRead: 'Sent'
      } as Message;
      this.listMessages.push(msg);
      this.scrollToBottom();
      this.imageService.addEventClickViewImage();
      this.addMsgToListMedia(msg);
      if (this.groupInfo.type == GROUP_TYPE.Nomal && this.groupInfo.group_nomal_type == GROUP_NOMAL_TYPE.Nomal && !this.totalJobseekerMsg) {
        this.totalJobseekerMsg++;
      }
    });
    this.subscription.add(handleEventSentSuccesssMessageSubject);
  }

  addMsgToListMedia(msg: Message) {
    // add to list if is file
    if (msg.content_type == CHAT_CONTENT_TYPE.Text) { return; }
    this.subjectService.addMsgToListMedia.next(true);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  onScroll(event: any) {
    // visible height + pixel scrolled >= total height
    if (event.target.scrollTop == 0) {
      if (this.listMessage.length < this.paginationMessageConfig.totalRecord) {
        let number = this.listMessage.length / 20 + 1;
        event.target.scrollTop = event.target.scrollHeight / number;
        setTimeout(() => {
          this.getListConversationDetail(this.groupId, false);
        }, 300);
      }
      if (this.listMessage.length > this.paginationMessageConfig.totalRecord) {
        return;
      }
    }
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
      //console.log('End');
    }
  }
  private scrollToBottom(): void {
    // if (this.disableScrollDown) {
    //     return
    // }
    try {
      setTimeout(() => {
        if (!this.myScrollContainer || !this.myScrollContainer.nativeElement) { return; }
        this.myScrollContainer.nativeElement.scroll({
          top: this.myScrollContainer.nativeElement.scrollHeight,
          left: 0,
          behavior: 'smooth'
        });
      }, 300);
      // this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;

    } catch (err) { }
  }
  showJobSeekerInfo() {
    this.boxInfo = this.boxInfo ? false : true;
  }

  closeApplicantsInfo() {
    this.boxInfo = false;
  }

  onResize(event) {
    const width = this.helperService.windowRef.innerWidth;
  }

  genUrlSeo(item){
    if(!item.job_title || item.job_id == 0){
      return `/company/${item?.company_name}-${item.company_id}`
    }else{
      return `/job/${this.jobService.deleteSpecialText(this.helperService.convertToSlugUrl(item.job_title, item.job_id))}`;
    }
  }

  getListConversation() {
    this.isSearching = true;
    this.isLoadingListConversation = true;
    const condition = this.getSearchConditionListConversation();
    this.messageService.getListConversation(condition).subscribe(res => {
      this.isSearching = false;
      this.isLoadingListConversation = false;
      this.paginationConversationConfig.totalRecord = res?.total;
      this.dataConversation = res.listConversation.map(item => {
        return {
          ...item,
          urlSeo: this.genUrlSeo(item)
        };
      });

      if (!this.groupId) {
        if (!this.dataConversation || this.dataConversation.length == 0) {
          this.groupId = this.user.chat_group_id;
        } else {
          const conv = this.dataConversation[0];
          this.groupId = conv.group_id;
        }
        this.getListConversationDetail(this.groupId, true);
      }
    }, err => {
      this.isSearching = false;
      this.isLoadingListConversation = false;
      this.helperService.showToastError(err);
    });
  }
  getConversationSupportDetail() {
    this.messageService.getListConversation({ isSupport: 1 }).subscribe(res => {
      this.supportConversation = res.listConversation[0];
    }, err => {
    });
  }

  getListConversationDetail(id, isSwitch, closeCol = false) {
    this.imageService.addEventInitClickViewImage();
    this.querySearch.groupId = id;
    const query = this.messageService.convertObjectToQuery(this.querySearch);
    this.previousRouteService.replaceStage(`/messages?${query}`);
    if (this.previousUrl != `/messages?${query}`) this.subjectService.previousUrlMessage.next(`/messages?${query}`);
    this.groupId = id;
    if (isSwitch) {
      this.paginationMessageConfig.currentPage = 0;
      this.listMessages = [];
      this.listMessage = [];
      this.paginationMessageConfig.totalRecord = 0;
      this.totalemployerMsg = 0;
      this.totalJobseekerMsg = 0;
    }
    this.isLoadingConversationDetail = true;
    if (!isSwitch) {
      this.paginationMessageConfig.currentPage++;
    }
    const condition = this.getSearchConditionConversationDetail();

    this.messageService.getConversationDetail(condition, id).subscribe(res => {
      this.groupInfo = res.groupInfo as GroupInfo;

      if (this.groupInfo) {
        if (this.groupInfo.type == GROUP_TYPE.Support) {
          this.currentCompany = {};
          this.isCheckGetVote = true;
        } else {
          if (typeof (this.groupInfo.job_id) == 'number' && this.groupInfo.job_id) {
            this.groupInfo.job_id && this.getjobDetails(this.groupInfo.job_id);
          }
        }
      }
      if (this.paginationMessageConfig.currentPage == 0) {
        // set seen
        this.messageService.handleEventEmitSeenMessageWhenGetList(
          res.listMessage[0]?.group_id, res.listMessage[0]?.user_id,
          this.user.avatar, `${this.user.firstName} ${this.user.lastName}`,
          res.listMessage[0]?.content_type, res.listMessage[0]?.content,
          this.user.acc_type, this.user.company_name, this.user.employer_title,
          this.user.employer_id, this.user.id, res.listMessage[0]?.id);

        //
        setTimeout(() => {
          if (this.dataConversation && this.dataConversation.length > 0) {
            const conversation = this.dataConversation.find(msg => msg.group_id == this.groupInfo.id);
            if (conversation) {
              this.groupInfo.can_view_profile = conversation.can_view_profile;
              this.collapses[conversation.company_id] = true;
              if (this.groupInfo && this.groupInfo.type == GROUP_TYPE.Nomal) {
                this.currentCompany = conversation;
                this.currentLogoCompany = `${this.currentCompany.company_profile_picture}`;
              }
            }
          }
          // update last message in
          this.messageService.updateLastMessageToListConversation(res.listMessage[0], null, this.dataConversation, this.supportConversation);
        }, 1000);
        // can_view_profile
      }
      this.isSearching = false;
      this.isLoadingConversationDetail = false;
      this.paginationMessageConfig.totalRecord = res?.total;
      res.listMessage.forEach(msg => {
        if (msg.user_acc_type == USER_TYPE.EMPLOYER) {
          this.totalemployerMsg = this.totalemployerMsg + 1;
        }
        if (msg.user_acc_type == USER_TYPE.JOB_SEEKER) {
          this.totalJobseekerMsg = this.totalJobseekerMsg + 1;
        }
      });
      //console.log(this.totalemployerMsg);

      this.listMessage = this.listMessage.reverse().concat(res.listMessage);
      this.listMessages = this.listMessage.reverse();
      if (isSwitch) { this.scrollToBottom(); }
      const isSmallScreen = this.breakpointObserver.isMatched('(max-width: 768px)');
      if (!isSmallScreen) {
        this.boxInfo = true;
      }

    }, err => {
      this.isSearching = false;
      this.isLoadingConversationDetail = false;
      // this.helperService.showToastError(err);
    });
    closeCol && this.closeColLeft();
    this.closeApplicantsInfo();
  }

  getSearchConditionListConversation() {
    const condition: any = {
      page: this.paginationConversationConfig.currentPage,
      pageSize: this.paginationConversationConfig.maxRecord,
    };

    if (this.querySearch.q) {
      condition.q = this.querySearch.q;
    }

    condition.searchType = this.querySearch.searchType;
    condition.isGroup = 0;
    return condition;
  }

  getSearchConditionConversationDetail() {
    const condition: any = {
      page: this.paginationMessageConfig.currentPage,
      pageSize: this.paginationMessageConfig.maxRecord
    };

    // if (this.querySearch.category) {
    //   let numberCategory = this.querySearch.category[0]?.id
    //   condition.categoryId = numberCategory;
    // }

    return condition;
  }

  getjobDetails(id) {
    const condition = this.getSearchConditionListConversation();
    condition.jobId = id;
    this.jobService.getjobDetails(id).subscribe(jobDetails => {
      this.applicantsService.getListApplicantsByJobseeker(id).subscribe(data => {
        this.isSearching = false;
        this.listApplicants = data.listApplicants[0];
        if (this.dataConversation) {
          this.currentCompany = this.dataConversation.find(con => con.group_id === this.listApplicants.group_id);
          this.currentLogoCompany = `${this.currentCompany.company_profile_picture}`;
        }
        this.currentCompany = Object.assign({}, jobDetails, this.currentCompany);
      }, errorRes => {
        this.isSearching = false;
        // this.isLoadingListApplicants = false;
        this.helperService.showToastError(errorRes);
      });
    });

  }

  sendMessage() {
    if ((!this.message || !this.message.match(/./g)) && this.fileDrop === null) {
      return;
    }

    const socketMessage = {
      group_id: this.groupId,
      current_user: {
        id: this.user.id,
        avatar: this.user.avatar,
        first_name: this.user.firstName,
        last_name: this.user.lastName,
        acc_type: this.user.acc_type,
        company_name: this.user.company_name,
        employer_title: this.user.employer_title,
        employer_id: this.user.employer_id
      },
      job_id: this.groupInfo.job_id,
      mime_type: '',
      updated_user_id: this.user.id
    } as SocketMessage;

    if (this.fileDrop) {
      socketMessage.content_type = CHAT_CONTENT_TYPE.Complex;
      socketMessage.content = this.fileDrop.url;
      socketMessage.mime_type = this.fileDrop.type?.toString();
      socketMessage.content_html = this.messageService.genMessageWithFile(this.message, this.fileDrop);
      this.messageService.SendMessage(socketMessage);
    } else {
      if (this.avtFile?.length == 0 || this.avtFile == null) {
        socketMessage.content_type = CHAT_CONTENT_TYPE.Text;
        socketMessage.content = this.message;
        this.messageService.SendMessage(socketMessage);
      }
    }
    this.message = null;
    this.avtFile = [];
    this.fileDrop = null;
  }

  handleUpload(event) {
    const socketMessage = {
      group_id: this.groupId,
      current_user: {
        id: this.user.id,
        avatar: this.user.avatar,
        first_name: this.user.firstName,
        last_name: this.user.lastName,
        acc_type: this.user.acc_type,
        company_name: this.user.company_name,
        employer_title: this.user.employer_title,
        employer_id: this.user.employer_id
      },
      job_id: this.groupInfo.job_id,
      mime_type: '',
      updated_user_id: this.user.id
    } as SocketMessage;

    this.imageChangedEvent = event;
    this.selectedFiles = event.target.files;
    const file = event.target.files[0];
    this.isMaxSizeImage = false;
    if (!this.fileService.isFileAcceptMessage(file.type, file.name)) {
      this.helperService.showToastError(MESSAGE.WARNING_FILE_NOT_SUPPORT);
      this.avtFile = [];
      return;
    }
    if (file.size > MAX_SIZE_IMAGE_UPLOAD) {
      this.isMaxSizeImage = true;
      this.helperService.showToastError(MESSAGE.WARNING_SIZE_UPLOAD_FILE);
      this.avtFile = [];
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.avtBase64.push(reader.result as string);
    };
    this.avtFile.push(file);

    setTimeout(() => {
      this.uploadFile(socketMessage);
    }, 700);
  }

  cancelImage() {
    this.avtFile = null;
    this.imageChangedEvent = null;
    const imageUploadEl: any = document.getElementById('upload-img');
    imageUploadEl.value = '';
  }

  search(a) {
    this.getListConversation();
  }

  changeSearch() {
    setTimeout(() => {
      this.getListConversation();
    }, 700);
  }

  uploadFile(socketMessage) {
    const formData = new FormData();
    formData.append('file', this.avtFile[0]);
    formData.append('uploadType', CHAT_CONTENT_TYPE.File.toString());
    this.messageService.uploadImage(formData).subscribe((res: any) => {
      if (res) {
        socketMessage.content_type = listImageAcceptMessage.includes(this.avtFile[0].type) ? CHAT_CONTENT_TYPE.Image : CHAT_CONTENT_TYPE.File;
        socketMessage.content = `${res.url}`;
        this.messageService.SendMessage(socketMessage);
        this.resetUpload(formData);
      }
    }, () => {
      this.resetUpload(formData);
    });
  }
  resetUpload(formData) {
    formData.delete('file');
    formData.delete('uploadType');
    this.message = null;
    this.avtFile = [];
  }
  openColLeftInMobile() {
    this.colLeftInMobile = !this.colLeftInMobile;
  }

  closeColLeft() {
    this.colLeftInMobile = false;
  }

  showModalReportEmployer(modalReportEmployer) {
    if (this.user) {
      this.modalReportEmployerRef = this.modalService.open(modalReportEmployer, {
        windowClass: 'modal-report-company',
        size: 'l'
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  downloadHistoryChat(id) {
    this.messageService.downloadHistoryChat(id);
  }

  toggleCollapse(conversation: Conversation) {
    const isCollapse = this.collapses[conversation.company_id];
    //console.log(this.collapses);
    this.collapses[conversation.company_id] = !isCollapse;
  }

  onFileDropped(files) {
    // this.handleUpload(files, true);
    const maxSize = MAX_SIZE_IMAGE_UPLOAD;
    const file = files[0];
    this.isMaxSizeImage = false;
    if (file.size > maxSize) {
      this.isMaxSizeImage = true;
      this.helperService.showToastError(MESSAGE.WARNING_SIZE_UPLOAD_FILE);
      return;
    }

    this.isUploading = true;
    setTimeout(() => {
      if (this.fileDrop !== null) {
        this.deleteFile(this.fileDrop.url, file);
      }
      this.uploadDropFile(file);
    }, 700);
  }

  deleteFile(url: string, file: File, isClickDelete: boolean = false) {
    this.userService.deleteEmployerPhoto({
      path: url
    }).subscribe(res => {
      if (res) {
        this.fileDrop = null;
        if (!isClickDelete) {
          this.uploadDropFile(file);
        }
      }
    });
  }

  uploadDropFile(file: File) {
    if (file) {
      this.fileDrop = {};
      this.fileDrop.mime_type = file.type;
      if (this.fileService.isFileAcceptMessage(file.type, file.name)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('uploadType', '2');
        if (listImageAcceptMessage.includes(file.type)) {
          this.fileDrop.type = CHAT_CONTENT_TYPE.Image;
        } else {
          this.fileDrop.type = CHAT_CONTENT_TYPE.File;
        }
        this.messageService.uploadImage(formData).subscribe((res: any) => {
          if (res) {
            this.fileDrop.url = `${res.url}`;
            this.fileDrop.name = res.url.substring(res.url.lastIndexOf('/') + 1);
          }
          this.isUploading = false;
        }, (error) => {
          this.isUploading = false;
        });
      } else {
        this.helperService.showToastError(MESSAGE.WARNING_FILE_NOT_SUPPORT);
        this.fileDrop = null;
      }
      this.isUploading = false;
    }
  }

  showModalViewImage(linkImage): any {
    const modalViewImageRef = this.modalService.open(ModalViewImageComponent, {
      windowClass: 'modal-view-image',
      size: 'xl'
    });

    modalViewImageRef.componentInstance.linkImage = linkImage;
  }
  onScrollConversationList(findGroup = false) {
    console.log("scrolled down!!");
    if (this.dataConversation.length >= this.paginationConversationConfig.totalRecord) {
      return;
    }
    this.paginationConversationConfig.currentPage++;
    this.getMoreListConversation(findGroup);

  }
  getMoreListConversation(findGroup = false) {
    this.isViewMoreConversation = true;
    let condition = this.getSearchConditionListConversation();
    this.messageService.getListConversation(condition).subscribe(res => {
      this.isViewMoreConversation = false;
      // this.paginationConversationConfig.totalRecord = res?.total;
      this.dataConversation = this.dataConversation.concat(res.listConversation);
      if (findGroup && !this.isIncludeGroupInConversationList()) {
        this.onScrollConversationList(true);
      }
    }, err => {
      this.isViewMoreConversation = false;
      this.helperService.showToastError(err);
    })
  }
  isIncludeGroupInConversationList() {
    if (this.dataConversation && this.dataConversation.length > 0) {
      const conversation = this.dataConversation.find(msg => msg.group_id == this.groupId);
      if (conversation && conversation.group_id) {
        this.collapses[conversation.job_id] = true;
        this.scrollToSelectedGroup();
      }
      return conversation != null;
    }
    return false;
  }
  private scrollToSelectedGroup(): void {
    try {
      setTimeout(() => {
        const element = document.getElementById(`group-${this.groupId}`);
        if (!element) { return; }
        element.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (err) {
      console.error(err);
    }
  }
}
