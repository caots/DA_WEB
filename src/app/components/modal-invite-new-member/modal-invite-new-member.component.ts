import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MESSAGE } from 'src/app/constants/message';

import { HelperService } from 'src/app/services/helper.service';
import { EmployerMemberService } from 'src/app/services/employer.member.service';

@Component({
  selector: 'ms-modal-invite-new-member',
  templateUrl: './modal-invite-new-member.component.html',
  styleUrls: ['./modal-invite-new-member.component.scss']
})
export class ModalInviteNewMemberComponent implements OnInit {
  @Output() close = new EventEmitter();
  @Output() inviteMember = new EventEmitter();
  formInviteMember: FormGroup;
  listPermission: any;
  createNewJobPosting: boolean = false;
  changeCompanyInfo: boolean = false;
  directMessage: boolean = false;
  changeBilling: boolean = false;
  isFirstTime: boolean = false;
  @Input() memberItem: any;
  checkInvite: boolean = false;
  warningEmailExists: string;
  constructor(
    private fb: FormBuilder,
    private helperService: HelperService,
    private activatedRoute: ActivatedRoute,
    private employerService: EmployerMemberService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.isFirstTime = true;
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['action'] === 'edit') {
        this.listPermission = this.employerService.getListPermission();
        this.checkInvite = false;
        this.formInviteMember.get('firstName').setValue(this.memberItem?.firstName);
        this.formInviteMember.get('lastName').setValue(this.memberItem?.lastName);
        this.formInviteMember.get('email').setValue(this.memberItem?.email);
        // this.formInviteMember.get('password').setValue("null");
        this.formInviteMember.get('jobTitle').setValue(this.memberItem?.employerTitle);
        this.memberItem.permission.listPermission.map((per, index) => {
          if (per.checked) {
            this.listPermission[index].checked = true;
          }
        })
      } else {
        this.checkInvite = true;
        this.initPermission();
      }
    })
  }

  initPermission() {
    this.listPermission = this.employerService.getListPermission();
  }

  initForm() {
    this.formInviteMember = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required,
         Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)]],
      // password: ['', [Validators.required]],
      jobTitle: ['', [Validators.required]],
    })
  }

  closeModal() {
    this.close.emit();
  }

  inviteMembers(form) {
    this.isFirstTime = false;
    this.helperService.markFormGroupTouched(this.formInviteMember);
    if (this.formInviteMember.invalid || this.validatePermission()) {
      return;
    }

    let roles = [];
    if (this.listPermission) {
      this.listPermission.map(role => {
        if (role.checked) {
          roles.push(role.id);
        }
      })
    }

    if(this.checkInvite){
      this.inviteMemberSaved(form, roles);
    }else{
      this.updateMemberSaved(form, roles);
    }

  }

  inviteMemberSaved(form ,roles ){
    let data = {
      email: form.email.toLowerCase(),
      // password: '123456',
      first_name: form.firstName,
      last_name: form.lastName,
      employer_title: form.jobTitle,
      permissions: roles
    }

    this.employerService.inviteMember(data).subscribe(res => {
      this.helperService.showToastSuccess(MESSAGE.INVITED_MEMBER_SUCCESSFULY);
      this.inviteMember.emit();
    }, errorRes => {
      //console.log(errorRes);
      if (errorRes.indexOf('Email already exists') >= 0) {
        this.warningEmailExists = MESSAGE.EXSITS_EMAIL;
      } else {
        this.helperService.showToastError(errorRes);
      }
    });
  }

  updateMemberSaved(form ,roles ){
    let data = {
      first_name: form.firstName,
      last_name: form.lastName,
      employer_title: form.jobTitle,
      permissions: roles
    }
    this.employerService.updateMember(data, this.memberItem.id).subscribe(res => {
      this.helperService.showToastSuccess(MESSAGE.UPDATE_MEMBER_SUCCESSFULY);
      window.location.reload();
    }, errorRes => {
      this.helperService.showToastError(errorRes);
    });
  }

  onChangeCheckbox(item, index) {
    this.listPermission.forEach(element => {
      if (element.id === index) {
        element.checked = !element.checked;
      }
    });

  }

  validatePermission() {
    return !this.listPermission.some(item => item.checked);
  }
}
