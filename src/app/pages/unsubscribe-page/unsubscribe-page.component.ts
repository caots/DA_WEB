import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { HelperService } from 'src/app/services/helper.service';
import { AuthService } from 'src/app/services/auth.service';
import { REASON_UNSUBSCRIBE_EMAIL, USER_TYPE } from 'src/app/constants/config';
import { UserService } from 'src/app/services/user.service';
import { MESSAGE } from 'src/app/constants/message';
import { SubjectService } from 'src/app/services/subject.service';
import { UserInfo } from 'src/app/interfaces/userInfo';

@Component({
  selector: 'ms-unsubscribe-page',
  templateUrl: './unsubscribe-page.component.html',
  styleUrls: ['./unsubscribe-page.component.scss']
})
export class UnsubscribePageComponent implements OnInit {
  public form: FormGroup;
  public isCallingApi: boolean = false;
  isSubmit: boolean = false;
  submitSuccess: boolean = false;
  reasonUnsubcribe: string;
  email: string;
  type: number = USER_TYPE.JOB_SEEKER;
  listReason: any[];
  user: UserInfo;
  REASON_UNSUBSCRIBE_EMAIL = REASON_UNSUBSCRIBE_EMAIL;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private helperService: HelperService,
    private subjectService: SubjectService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.email) {
        this.email = params.email;
      }
      if (params.type) {
        this.type = params.type;
      }
    });
    this.subjectService.user.subscribe(user => {
      if (user) this.user = user;
    })
    this.listReason = this.getListReason();
  }

  confirm() {
    this.isSubmit = true;
    if (this.validateReason()) {
      return;
    }
    this.isCallingApi = true;
    const type = this.listReason.find(reason => reason.checked === true)?.id;
    const body = {
      email: this.email,
      reason_unsubcribe: type === REASON_UNSUBSCRIBE_EMAIL.OTHER ? this.reasonUnsubcribe : '',
      reason_unsubcribe_type: type
    }
    this.userService.unsubscribeReceive(body).subscribe((res: any) => {
      this.isCallingApi = false;
      this.submitSuccess = true;
      this.helperService.showToastSuccess(MESSAGE.UNSUBSCRIBE_SUUCCESS);
    }, resError => {
      this.isCallingApi = false;
      this.helperService.showToastError(resError);
    })
  }

  validateReason() {
    return !this.listReason.some(item => item.checked);
  }

  onChangeCheckbox(item, index) {
    this.listReason[index].checked = true;
    this.listReason.forEach(reason => {
      if (reason.id == item.id) return;
      reason.checked = false;
    })
  }

  getListReason() {
    return [
      {
        id: REASON_UNSUBSCRIBE_EMAIL.DONT_RECIVE,
        name: 'I no longer want to receive these emails.',
        checked: false,
      },
      {
        id: REASON_UNSUBSCRIBE_EMAIL.NEVER_SIGNING,
        name: 'I never signed up for this malling list.',
        checked: false,
      },
      {
        id: REASON_UNSUBSCRIBE_EMAIL.RECIVE_MANY_EMAIL,
        name: 'I receive too many of these emails.',
        checked: false,
      },
      {
        id: REASON_UNSUBSCRIBE_EMAIL.OTHER,
        name: 'Other.',
        checked: false,
      }
    ]
  }

  goToHomePage() {
    if(this.type == USER_TYPE.EMPLOYER){
      this.router.navigate(['/landing-employer']);
    }else{
      this.router.navigate(['/landing-jobseeker']);
    }
  }

}
