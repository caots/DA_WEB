import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { PAGING, PERMISSION_TYPE } from 'src/app/constants/config';
import { HelperService } from 'src/app/services/helper.service';
import { EmployerMember } from 'src/app/interfaces/employerMember';
import { PaginationConfig } from 'src/app/interfaces/paginattionConfig';
import { EmployerMemberService } from 'src/app/services/employer.member.service';
import { AuthService } from 'src/app/services/auth.service';
import { PermissionService } from 'src/app/services/permission.service';
import { MESSAGE } from 'src/app/constants/message';

@Component({
  selector: 'ms-manage-members',
  templateUrl: './manage-members.component.html',
  styleUrls: ['./manage-members.component.scss']
})

export class ManageMembersComponent implements OnInit {
  listMembers: Array<EmployerMember> = [];
  modalInviteMembersRef: NgbModalRef;
  memberItem: any;
  userData: any;
  paginationConfig: PaginationConfig;
  isLoadingMember: boolean;
  premission = PERMISSION_TYPE;

  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    public permissionService: PermissionService,
    private router: Router,
    private employerService: EmployerMemberService,
    private helperService: HelperService,
  ) { }

  ngOnInit(): void {
    this.paginationConfig = {
      currentPage: 0,
      totalRecord: 0,
      maxRecord: PAGING.MAX_ITEM
    }
    this.authService.getUserInfo().subscribe(user => {
      this.userData = user;
    })
    this.getListMembers();
  }

  getCondition() {
    let condition: any = {
      page: this.paginationConfig.currentPage,
      pageSize: this.paginationConfig.maxRecord,
    }
    return condition;
  }

  getListMembers() {
    this.isLoadingMember = true;
    let condition = this.getCondition();
    this.employerService.getListMember(condition).subscribe(res => {
      this.isLoadingMember = false;
      this.listMembers = res.listEmployer;
      this.paginationConfig.totalRecord = res.total;
    }, errorRes => {
      this.isLoadingMember = false;
      console.log(errorRes);
      this.helperService.showToastError(errorRes);
    });

  }

  paginationMembers(page) {
    this.paginationConfig.currentPage = page;
    this.getListMembers();
  }

  editMember(members, modalInviteMembers) {
    this.showModalInviteMember(modalInviteMembers);
    this.memberItem = members;
    this.router.navigate(['/employer-profile/member'], { queryParams: { action: "edit" } });
  }

  showModalInviteMember(modalInviteMembers) {
    this.router.navigate(['/employer-profile/member'], { queryParams: { action: "invite" } });
    this.modalInviteMembersRef = this.modalService.open(modalInviteMembers, {
      windowClass: 'modal-invite-members',
      size: 'md'
    })
  }

  inviteMember() {
    this.modalInviteMembersRef.close();
    this.getListMembers();
  }

  async deleteDelegateAccount(member: EmployerMember) {
    const isConfirm = await this.helperService.confirmPopup(MESSAGE.CONFIRM_DELETE_DELEGATE_ACCOUNT, MESSAGE.BTN_YES_TEXT, MESSAGE.BTN_NO_TEXT);
    if (isConfirm) {
      this.employerService.deleteMember(member.id).subscribe(res => {
        this.helperService.showToastSuccess(MESSAGE.DELETE_DELEGATE_ACCPOUNT_SUCCESSFULLY);
        this.getListMembers();
      }, err => {
        this.helperService.showToastError(err);
      })
    }
  }

  sendMailDelegateAccount(member: EmployerMember) {
    this.employerService.sendMailMember(member.id).subscribe(res => {
      this.helperService.showToastSuccess(MESSAGE.SENDMAIL_DELEGATE_SUCCESSFULY);
    }, err => {
      this.helperService.showToastError(err);
    })
  }
}
