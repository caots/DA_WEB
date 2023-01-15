import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { get } from 'lodash';

import { GROUP_TYPE, USER_TYPE, PERMISSION_TYPE, USER_STATUS, listFileAcceptMessage, listImageAcceptMessage, CHAT_GROUP_STATUS, GROUP_NOMAL_TYPE, TRACKING_RECRUITMENT_TYPE, SALARY_TYPE } from 'src/app/constants/config';
import { HelperService } from 'src/app/services/helper.service';
import { PaginationConfig } from 'src/app/interfaces/paginattionConfig';
import { MessageService } from 'src/app/services/message.service';
import { Conversation, FileDrop, GroupInfo, Message, SocketMessage } from 'src/app/interfaces/message';
import { ShowApplicant } from 'src/app/interfaces/applicants';
import { environment } from 'src/environments/environment';
import { SubjectService } from 'src/app/services/subject.service';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { ApplicantsService } from 'src/app/services/applicants.service';
import { Applicants } from 'src/app/interfaces/applicants';
import { MAX_SIZE_IMAGE_UPLOAD, CHAT_CONTENT_TYPE, CHAT_HISTORY } from 'src/app/constants/config';
import { SearchConversation } from 'src/app/interfaces/search';
import { PermissionService } from 'src/app/services/permission.service';
import { PreviousRouteService } from 'src/app/services/previous-route.service';
import { Subscription } from 'rxjs';
import { MESSAGE } from 'src/app/constants/message';
import { UserService } from '../../../services/user.service';
import { FileService } from 'src/app/services/file.service';
import { ModalViewImageComponent } from 'src/app/components/modal-view-image/modal-view-image.component';
import { ImageService } from 'src/app/services/image.service';
import { JobService } from 'src/app/services/job.service';
@Component({
  selector: 'ms-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class MessagesComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  @ViewChild('scrollChat') myScrollContainer: ElementRef;
  paginationConversationConfig: PaginationConfig;
  paginationMessageConfig: PaginationConfig;
  querySearch: SearchConversation;
  isSearching: boolean;
  isLoadingListConversation: boolean;
  isLoadingArchived = false;
  dataConversation: Conversation[];
  isLoadingConversationDetail = true;
  listMessages: Message[] = [];
  boxInfo: boolean;
  modalAddMembersRef: NgbModalRef;
  modalViewImageRef: NgbModalRef;
  user: UserInfo;
  listApplicants: Applicants;
  listApplicantsDraft: Applicants;
  avtFile: Array<any> = [];
  message: any;
  avtBase64: Array<any> = [];
  imageChangedEvent: any;
  selectedFiles: any;
  isMaxSizeImage: boolean;
  jobId: number;
  listMessage: Message[] = [];
  stage: any;
  groupId: number;
  groupInfo: GroupInfo;
  voteResponsive: any;
  isCheckGetVote: boolean = false;
  GROUP_TYPE = GROUP_TYPE;
  USER_TYPE = USER_TYPE;
  CHAT_CONTENT_TYPE = CHAT_CONTENT_TYPE;
  canViewProfile = 0;
  supportConversation: Conversation;
  colLeftInMobile: boolean = true;
  permission = PERMISSION_TYPE;
  totalJobseekerMsg: number;
  modalReportApplicantRef: NgbModalRef;
  isReportAdmin: boolean = false;
  collapses = [];
  fileDrop: FileDrop = null;
  isUploading: boolean = false;
  isShowApplicant: boolean = false;
  CHAT_GROUP_STATUS = CHAT_GROUP_STATUS;
  currentLogoCompany: string;
  potentialCandidate: any;
  currentJobseeker: any;
  isViewMoreConversation: boolean;
  USER_STATUS = USER_STATUS;
  previousUrl: string;
  API_S3 = environment.api_s3;

  constructor(
    public permissionService: PermissionService,
    private helperService: HelperService,
    public messageService: MessageService,
    private modalService: NgbModal,
    private router: Router,
    private applicantService: ApplicantsService,
    private subjectService: SubjectService,
    private applicantsService: ApplicantsService,
    private activatedRoute: ActivatedRoute,
    private previousRouteService: PreviousRouteService,
    public breakpointObserver: BreakpointObserver,
    private userService: UserService,
    public fileService: FileService,
    public imageService: ImageService,
    private jobService: JobService,
  ) {
  }

  ngOnInit(): void {
    this.boxInfo = false;
    this.messageService.getCountMessageUnread().subscribe();
    this.subjectService.previousUrlMessage.subscribe(data => {
      this.previousUrl = data;
    })
    this.subjectService.user.subscribe(user => {
      if (!user) {
        return;
      }
      this.user = user;
      const pathCurrentLogoCompany = (this.user.acc_type == USER_TYPE.EMPLOYER && !this.user.employer_id)
        ? this.user?.company_profile_picture : this.user.employerInfo?.company_profile_picture;
      this.currentLogoCompany = pathCurrentLogoCompany;
    });

    this.paginationMessageConfig = {
      currentPage: 0,
      totalRecord: 0,
      maxRecord: 20
    }
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.querySearch = new SearchConversation();
      this.paginationConversationConfig = {
        currentPage: 0,
        totalRecord: 0,
        maxRecord: 20
      }
      if (params.isGroup) { this.querySearch.isGroup = params.isGroup; }
      this.querySearch.searchType = params.searchType || 0;
      if (params.q) {
        this.querySearch.q = params.q;
      }
      if (params.groupId) {
        this.groupId = params.groupId;
        this.querySearch.groupId = params.groupId;
        this.getListConversationDetail(this.groupId, true, false, false);
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
      const message = this.listMessage.find(m =>
        m.id == msg.message_id &&
        this.user.id == senderId && this.user.id != msg.updated_user_id
      );
      if (!message) { return; }
      message.isRead = 'Received';
    })
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
      if (!message || message.user_acc_type == USER_TYPE.EMPLOYER) { return; }
      message.isRead = 'Seen';
      if (msg.isReadAll) {
        this.listMessages.forEach(m => {
          if (m.isRead && m.isRead != 'Seen') {
            m.isRead = 'Seen';
          }
        })
      }
    })
    this.subscription.add(handleEventListenSeenMessage);
  }
  handleEventListenMessage() {
    const handleEventListenMessage = this.messageService.sentMessageSubject.subscribe((res) => {
      if (!this.groupInfo || !this.groupInfo.id) {
        return
      }
      if (this.groupInfo?.id == res.group_id) {
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
        console.log(this.listMessages);

        this.messageService.handleEventEmitSeenMessage(res);
        this.scrollToBottom();
        this.imageService.addEventClickViewImage();
        if (msg.user_acc_type == USER_TYPE.JOB_SEEKER) {
          this.totalJobseekerMsg = this.totalJobseekerMsg + 1;
        }
        this.addMsgToListMedia(msg);
      } else {
        this.messageService.handleEventEmitReceiveMessage(res);
        this.messageService.updateLastMessageToListConversation(null, res, this.dataConversation, this.supportConversation);
      }
    })
    this.subscription.add(handleEventListenMessage);
  }

  handleEventSentSuccesssMessageSubject() {
    const handleEventSentSuccesssMessageSubject = this.messageService.sentSuccesssMessageSubject
      .subscribe((res: SocketMessage) => {
        //console.log(res)
        if (!this.groupInfo || !this.groupInfo.id || this.groupInfo.id != res.group_id) {
          return
        }

        const msg = {
          content: res.content,
          content_html: res.content_html,
          content_type: res.content_type,
          user_id: res.current_user.id,
          user_first_name: res.current_user.first_name,
          user_last_name: res.current_user.last_name,
          group_id: res.group_id,
          id: res.message_id,
          mime_type: res.mime_type,
          isRead: 'Sent'
        } as Message
        this.listMessages.push(msg);
        this.scrollToBottom();
        this.imageService.addEventClickViewImage();
        // call to server already messaged applicant
        if (this.groupInfo.group_nomal_type == GROUP_NOMAL_TYPE.Nomal) {
          if (this.listApplicants && !this.listApplicants.canRateStars) {
            this.applicantsService.updateCanRateStars(this.listApplicants.userId).subscribe(() => {
              this.listApplicants.canRateStars = 1;
            })
          }
        } 
        this.addMsgToListMedia(msg);
      })
    this.subscription.add(handleEventSentSuccesssMessageSubject);
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  addMsgToListMedia(msg: Message) {
    // add to list if is file
    if (msg.content_type == CHAT_CONTENT_TYPE.Text) { return; }
    this.subjectService.addMsgToListMedia.next(true);
  }
  onScrollConversationList(findGroup = false) {
    console.log("scrolled down!!");
    if (this.dataConversation.length >= this.paginationConversationConfig.totalRecord) {
      return;
    }
    this.paginationConversationConfig.currentPage++;
    this.getMoreListConversation(findGroup);

  }
  onScroll(event: any) {
    // //console.log(event.target.offsetHeight);
    // //console.log(event.target.scrollTop);
    // //console.log(event.target.scrollHeight)
    // visible height + pixel scrolled >= total height
    if (event.target.scrollTop == 0) {
      if (this.listMessage.length < this.paginationMessageConfig.totalRecord) {
        let number = this.listMessage.length / 20 + 2
        event.target.scrollTop = event.target.scrollHeight / number;
        setTimeout(() => {
          this.getListConversationDetail(this.groupId, false)
        }, 300);
      }
      if (this.listMessage.length > this.paginationMessageConfig.totalRecord) {
        return;
      }
    }
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
      //console.log("End");
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
    } catch (err) {
      console.error(err);
    }
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
  showJobSeekerInfo() {
    this.boxInfo = this.boxInfo ? false : true;
  }

  closeApplicantsInfo() {
    this.boxInfo = false;
  }

  onResize(event) {
    const width = this.helperService.windowRef.innerWidth;
  }

  getListConversation() {
    this.isLoadingListConversation = true;
    this.isSearching = true;
    let condition = this.getSearchConditionListConversation();
    this.messageService.getListConversation(condition).subscribe(res => {
      this.isSearching = false;
      this.isLoadingListConversation = false;

      this.paginationConversationConfig.totalRecord = res?.total;
      this.dataConversation = res.listConversation;
      if (!this.groupId) {
        if (!this.dataConversation || this.dataConversation.length == 0) {
          this.groupId = this.user.chat_group_id;
        } else {
          const conv = this.dataConversation[0];
          this.groupId = conv.group_id;
        }
        this.getListConversationDetail(this.groupId, true, false, false);
      } else if (!this.isIncludeGroupInConversationList()) {
        this.onScrollConversationList(true);
      }
    }, err => {
      this.isSearching = false;
      this.isLoadingListConversation = false;
      this.helperService.showToastError(err);
    })
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
  getConversationSupportDetail() {
    this.messageService.getListConversation({ isSupport: 1 }).subscribe(res => {
      this.supportConversation = res.listConversation[0];
    }, err => {
    })
  }
  async getListConversationDetail(id, isSwitch, updateRateBot = false, closeColLeft = true) {
    this.imageService.addEventInitClickViewImage();
    // this.colLeftInMobile && this.closeColLeft();
    this.querySearch.groupId = id;
    const query = this.messageService.convertObjectToQuery(this.querySearch);
    this.previousRouteService.replaceStage(`/employer-messages?${query}`);
    // save previous url
    if (this.previousUrl != `/employer-messages?${query}`) this.subjectService.previousUrlMessage.next(`/employer-messages?${query}`);
    this.groupId = id;
    if (isSwitch) {
      this.canViewProfile = 0;
      this.paginationMessageConfig.currentPage = 0;
      this.listMessages = [];
      this.listMessage = [];
      this.paginationMessageConfig.totalRecord = 0;
      this.totalJobseekerMsg = 0;
    }
    this.isLoadingConversationDetail = true;
    if (!isSwitch) {
      this.paginationMessageConfig.currentPage++;
    }
    let condition = this.getSearchConditionConversationDetail();

    this.messageService.getConversationDetail(condition, id).subscribe(res => {
      this.groupInfo = res.groupInfo as GroupInfo;
      if (this.groupInfo) {
        if (this.groupInfo.type == GROUP_TYPE.Support) {
          this.listApplicants = new Applicants();
          this.currentJobseeker = {};
          this.isCheckGetVote = true;
        } else {
          const jobseekerId = get(res, 'groupInfo.member_id', 0);
          if (typeof (this.groupInfo.job_id) == 'number' && this.groupInfo.job_id) {
            this.getApplicantsInfo(this.groupInfo.job_id, jobseekerId);
            this.potentialCandidate = undefined;
          } else {
            this.getPotentialInfo(jobseekerId);
          }
        }
      }

      if (this.paginationMessageConfig.currentPage == 0) {
        // set seen
        this.messageService.handleEventEmitSeenMessageWhenGetList(res.listMessage[0]?.group_id, res.listMessage[0]?.user_id, this.user.avatar, `${this.user.firstName} ${this.user.lastName}`, res.listMessage[0]?.content_type, res.listMessage[0]?.content, this.user.acc_type, this.user.company_name, this.user.employer_title, this.user.employer_id, this.user.id, res.listMessage[0]?.id)

        //
        setTimeout(() => {
          this.updateCurentConversation();
          // update last message in
          this.messageService.updateLastMessageToListConversation(res.listMessage[0], null, this.dataConversation, this.supportConversation);
        }, 1000);

      }
      this.isSearching = false;
      this.isLoadingConversationDetail = false;
      this.paginationMessageConfig.totalRecord = res?.total;
      res.listMessage.forEach((msg: Message) => {
        if (msg.user_acc_type == USER_TYPE.JOB_SEEKER) {
          this.totalJobseekerMsg = this.totalJobseekerMsg + 1;
        }
      })

      this.listMessage = this.listMessage.reverse().concat(res.listMessage);
      this.listMessages = this.listMessage.reverse();

      if (isSwitch) {
        this.scrollToBottom();
      }
      const isSmallScreen = this.breakpointObserver.isMatched('(max-width: 768px)');
      if (!isSmallScreen) {
        this.boxInfo = true;
      }
    }, err => {
      this.isSearching = false;
      this.isLoadingConversationDetail = false;
      // this.helperService.showToastError(err);
    })
    closeColLeft && this.closeColLeft();
    this.closeApplicantsInfo();
  }
  updateCurentConversation() {
    if (this.dataConversation && this.dataConversation.length > 0) {
      const conversation = this.dataConversation.find(msg => msg.group_id == this.groupInfo.id);
      if (conversation) {
        // can_view_profile
        this.canViewProfile = conversation.can_view_profile;
        this.collapses[conversation.job_id] = true;
        this.currentJobseeker = conversation;
      }
    }
  }
  updateCanViewProfile(canViewProfile: number) {
    this.groupInfo.can_view_profile = canViewProfile;
    if (this.dataConversation && this.dataConversation.length > 0) {
      const conversation = this.dataConversation.find(msg => msg.group_id == this.groupInfo.id);
      if (conversation) {
        this.canViewProfile = canViewProfile;
        conversation.can_view_profile = canViewProfile;
      }
    }
    if (this.groupInfo.group_nomal_type == GROUP_NOMAL_TYPE.DirectMessage) {
      this.potentialCandidate.can_view_profile = canViewProfile;
    } else {
      if (this.listApplicants) {
        this.listApplicants.can_view_profile = canViewProfile;
        this.listApplicantsDraft.can_view_profile = canViewProfile;
        this.listApplicants.canViewProfile = canViewProfile;
        this.listApplicantsDraft.canViewProfile = canViewProfile;
      }
    }
  }
  getSearchConditionListConversation() {
    let condition: any = {
      page: this.paginationConversationConfig.currentPage,
      pageSize: this.paginationConversationConfig.maxRecord,
    }

    if (this.querySearch.q) {
      condition.q = this.querySearch.q;
    }
    condition.searchType = this.querySearch.searchType;
    if (typeof (parseInt(this.querySearch.isGroup)) == 'number') {
      condition.isGroup = parseInt(this.querySearch.isGroup);
    }
    return condition;
  }

  getSearchConditionApplicant() {
    let condition: any = {
      page: 0,
      pageSize: 1,
    }
    return condition;
  }

  getSearchConditionConversationDetail() {
    let condition: any = {
      page: this.paginationMessageConfig.currentPage,
      pageSize: this.paginationMessageConfig.maxRecord
    }

    return condition;
  }

  showModalAddMembers(modalAddMembers) {
    this.modalAddMembersRef = this.modalService.open(modalAddMembers, {
      windowClass: 'modal-add-member',
      size: 'md'
    })
  }

  getApplicantsInfo(id, jobseekerId = 0) {
    let condition = this.getSearchConditionApplicant();
    condition.jobId = id
    if (jobseekerId) {
      condition.jobseekerId = jobseekerId;
    }
    // this.isLoadingListApplicants = true;
    this.applicantsService.getListApplicants(condition).subscribe(data => {
      this.isSearching = false;
      this.listApplicants = data.listApplicants[0];
      this.isShowApplicant = this.listApplicants.can_view_profile == 1;
      this.listApplicantsDraft = Object.assign({}, this.listApplicants);
      this.stage = this.listApplicants?.stage
      this.currentJobseeker = this.dataConversation.find(con => con.group_id === this.listApplicants.group_id);
      // this.isLoadingListApplicants = false;
      // this.paginationConfig.totalRecord = data.total;

    }, errorRes => {
      this.isSearching = false;
      // this.isLoadingListApplicants = false;
      // this.helperService.showToastError(errorRes);
    });
  }

  getPotentialInfo(jobseekerId = 0) {
    this.messageService.getPotentialCandidate(jobseekerId).subscribe((data: any) => {
      this.isSearching = false;
      this.potentialCandidate = data.results[0];
      this.currentJobseeker = this.dataConversation.find(con => con.group_id === this.potentialCandidate.group_id);
    }, errorRes => {
      this.isSearching = false;
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
      job_id: this.jobId,
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
    } as SocketMessage

    this.imageChangedEvent = event;
    this.selectedFiles = event.target.files;
    const file = event.target.files[0];
    this.isMaxSizeImage = false;
    console.log("file: ", file);
    if (!this.fileService.isFileAcceptMessage(file.type, file.name)) {
      console.log("file.type: ", file.type);
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
    }, 700)

  }

  search(a) {
    this.getListConversation()
  }

  onRateBot(data) {
    this.messageService.rateBot(data.userId, data.vote, this.groupInfo.group_nomal_type).subscribe(data => {
      if (this.voteResponsive) {
        this.voteResponsive['is_responsive'] = this.voteResponsive.is_responsive === 1 ? -1 : 1;
      }
      const jobSeeker = {
        id: this.currentJobseeker.jobSeeker_id,
        acc_type: USER_TYPE.JOB_SEEKER,
        firstName: this.currentJobseeker.jobSeeker_first_name,
        lastName: this.currentJobseeker.jobSeeker_last_name,
      }
    }, errorRes => {
    })
  }

  changeSearch() {
    setTimeout(() => {
      this.paginationConversationConfig.currentPage = 0;
      this.getListConversation();
      const query = this.messageService.convertObjectToQuery(this.querySearch);
      this.previousRouteService.replaceStage(`/employer-messages?${query}`);
    }, 700)
  }

  callbackApi() {
    this.getListConversationDetail(this.groupId, true)
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

  showModalReportApplicant(modalReportApplicant) {
    if (this.user) {
      this.modalReportApplicantRef = this.modalService.open(modalReportApplicant, {
        windowClass: 'modal-report-company',
        size: 'l'
      })
    } else {
      this.router.navigate(['/login']);
    }
  }

  async requestShowAvatar() {
  }

  downloadHistoryChat(id) {
    this.messageService.downloadHistoryChat(id)
  }

  toggleCollapse(conversation: Conversation) {
    const isCollapse = this.collapses[conversation.job_id];
    this.collapses[conversation.job_id] = !isCollapse;
  }

  viewApplicantWithPrivateJob(isShow) {
    //console.log(isShow);
    console.log(this.listApplicants);
    this.isShowApplicant = !isShow;
    if (this.listApplicants.jobIsPrivate != 1) return;
    this.listApplicants.can_view_profile = this.isShowApplicant ? 1 : 0;
    this.makeToViewApplicant(this.listApplicants.userId, { canViewProfile: this.listApplicants.can_view_profile });
  }

  makeToViewApplicant(id, body) {
    this.applicantService.updateViewApplicant(id, body).subscribe(res => {
      // this.getListConversation();
      const shareData: ShowApplicant = {
        id: this.listApplicants.userId,
        show: body.canViewProfile
      } as ShowApplicant;
      this.subjectService.isShowApplicant.next(shareData);
    }, errorRes => {
      this.helperService.showToastError(errorRes);
    });
  }

  onFileDropped(files) {
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
    }, 700)
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
    })
  }

  rateApplicant(rate) {
    let data = {
      rate,
      jobId: this.listApplicants.jobId
    }
    const currentConversation = this.dataConversation.find(item => item.group_id === this.listApplicants.group_id);
    if (currentConversation) {
      currentConversation.job_seeker_rate = rate;
    }
    this.applicantsService.updateRating(this.listApplicants.jobseekerId, data).subscribe(res => {
    }, errorRes => {
      this.helperService.showToastError(errorRes);
    });
  }

  showModalViewImage(linkImage): any {
    const modalViewImageRef = this.modalService.open(ModalViewImageComponent, {
      windowClass: 'modal-view-image',
      size: 'xl'
    })

    modalViewImageRef.componentInstance.linkImage = linkImage;
  }

  archivedGroup(conversation: Conversation, index = -1, jobId = 0, isAll = 0) {
    // //console.log(conversation.group_id);
    if (!conversation || this.isLoadingArchived) { return; }
    this.isLoadingArchived = true;
    const changeStatus = conversation.chat_groups_status == CHAT_GROUP_STATUS.Archived ? CHAT_GROUP_STATUS.Active : CHAT_GROUP_STATUS.Archived
    this.messageService.updateGroup(conversation.group_id, changeStatus, jobId, isAll).subscribe(res => {
      // //console.log(res);
      if (this.querySearch.searchType == `${CHAT_GROUP_STATUS.Archived}` || this.querySearch.searchType == `${CHAT_GROUP_STATUS.Active}`) {
        if (isAll) {
          this.dataConversation = this.dataConversation.filter(res => res.job_id != jobId);

        } else {
          this.dataConversation.splice(index, 1);
        }
      } else {
        conversation.chat_groups_status = changeStatus;
      }
      const message = `You have successfully ${changeStatus == CHAT_GROUP_STATUS.Active ? 'unarchived' : 'archived'} this ${isAll ? 'group' : 'conversation'}.`;
      this.helperService.showToastSuccess(message);
      this.isLoadingArchived = false;
    }, err => {
      this.isLoadingArchived = false;
      this.helperService.showToastError(err);
    });
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

  checkOwerAddMember(groupInfo) {
    if (this.permissionService.checkMasterOrJobseeker(this.user)) return true;
    return groupInfo.ower_id == this.user.id;
  }

  exportICSFile(listApplicants) {
    let title = '';
    if (listApplicants?.can_view_profile === 1) {
      title = `Interview with ${listApplicants?.firstName || ''} ${listApplicants?.lastName || ''} for ${listApplicants?.title || ''}`;
    } else {
      title = `Interview with ${listApplicants?.firstName || ''} for ${listApplicants?.title || ''}`;
    }
    const slugUrl = this.jobService.deleteSpecialText(this.helperService.convertToSlugUrl(listApplicants?.title, listApplicants.jobId));
    const urlJob = `${environment.url_webapp}/job/${slugUrl}`;
    const scheduleTime = listApplicants?.scheduleTime;
    const body = {
      title,
      scheduleTime,
      urlJob
    }
    this.messageService.downloadScheduleTimeICS(body).subscribe(res => { }, err => {
      this.helperService.showToastError(err);
    })

  }

  closeExportICSFIle() {
    let data = {
      schedule: '',
      stage: this.stage
    }
    this.applicantsService.addNote(Number(this.listApplicants.userId), data,
      this.groupInfo.job_id, this.groupInfo.company_id).subscribe(res => {
        this.callbackApi();
      }, errorRes => {
        this.helperService.showToastError(errorRes);
      });
  }

}
