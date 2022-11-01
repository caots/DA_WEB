import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SIGN_UP_STEP, SHOW_AVATAR_JOBSEEKER } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { SubjectService } from 'src/app/services/subject.service';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { JobService } from 'src/app/services/job.service';
import UsStates from "us-state-codes";

@Component({
  selector: 'ms-user-find-candidate-profile',
  templateUrl: './user-find-candidate-profile.component.html',
  styleUrls: ['./user-find-candidate-profile.component.scss']
})
export class UserFindCandidateProfileComponent implements OnInit {
  @Output() next = new EventEmitter();
  @Output() back = new EventEmitter();
  formUpdate: FormGroup;
  userInfo: UserInfo;
  initRegion: string
  isCallingApi: boolean;
  isMaxSizeImage: boolean;
  fileNameSelected: string;
  imageChangedEvent: any;
  croppedImage: File;
  countryCode: number = 1;
  nameCountry: string;
  listCity: Array<any> = [];
  listState: Array<any> = [];
  listPhoneCountry: Array<any> = environment.nationalPhone;
  imageChanged: string;
  SHOW_AVATAR_JOBSEEKER = SHOW_AVATAR_JOBSEEKER;
  MAXIMUM_UPLOAD_FILE: string = MESSAGE.MAXIMUM_UPLOAD_FILE;
  listCityStore: any[];

  constructor(
    private fb: FormBuilder,
    private subjectService: SubjectService,
    private helperService: HelperService,
    private userService: UserService,
    private authService: AuthService,
    private jobService: JobService,
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.subjectService.user.subscribe(user => {
      if (user) {
        this.userInfo = user;
        this.formUpdate.controls['salary'].setValue(user.salary && this.helperService.formatSalary(user.salary));
        this.formUpdate.controls['city'].setValue(user.cityName || '');
        this.formUpdate.controls['state'].setValue(user.stateName || '');
        this.formUpdate.controls['email'].setValue(user.email);
        this.formUpdate.controls['firstName'].setValue(user.firstName);
        this.formUpdate.controls['lastName'].setValue(user.lastName);
        if (user.signUpStep > SIGN_UP_STEP.STEP1) this.formUpdate.controls['enable_show_avatar'].setValue(user.enable_show_avatar || 0);
        else this.formUpdate.controls['enable_show_avatar'].setValue(SHOW_AVATAR_JOBSEEKER.ENABLE);
      }
    })
    this.getDataCity();
  }

  initForm() {
    this.formUpdate = this.fb.group({
      city: [''],
      state: [''],
      salary: [''],
      email: [''],
      firstName: [''],
      lastName: [''],
      enable_show_avatar: [SHOW_AVATAR_JOBSEEKER.ENABLE]
    })
  }


  save(form) {
    this.helperService.markFormGroupTouched(this.formUpdate);
    if (this.formUpdate.invalid) {
      return;
    }

    this.isCallingApi = true;
    const formData = new FormData();
    formData.append('email', form.email);
    formData.append('first_name', form.firstName);
    formData.append('last_name', form.lastName);
    formData.append('city_name', form.city || '');
    formData.append('state_name', form.state || '');
    formData.append('sign_up_step', SIGN_UP_STEP.STEP2.toString());
    formData.append('enable_show_avatar', form.enable_show_avatar);
    if (form.salary) {
      formData.append('asking_salary', this.jobService.switchSalary(form.salary));
    }

    this.userService.updateUser(formData).subscribe(res => {
      this.authService.getUserInfo().subscribe(user => {
        this.isCallingApi = false;
        this.next.emit();
      })
    }, errorRes => {
      this.isCallingApi = false;
      this.helperService.showToastError(errorRes);
    })
  }

  selectState(value) {
    const stateName = value;
    this.formUpdate.get('city').setValue('');
    const index = this.listState.findIndex(state => state == stateName);
    if (index >= 0) {
      const code = UsStates.getStateCodeByStateName(this.listState[index]);
      this.listCity = this.listCityStore.filter(res => res.adminCode == code);
    }

  }

  getDataCity(code = '') {
    this.listCityStore = [];
    this.jobService.getAllCity().subscribe(listCity => {
      this.listCityStore = listCity;
      this.getDataState();
    });
  }

  getDataState() {
    this.jobService.getAllState().subscribe(listState => {
      this.listState = listState;
      const index = this.listState.findIndex(state => state == this.userInfo.stateName);
      if (index >= 0) {
        const code = UsStates.getStateCodeByStateName(this.listState[index]);
        this.listCity = this.listCityStore.filter(res => res.adminCode == code);
      }
    })
  }

  onBackStep1(){
    this.back.emit();
  }
}
