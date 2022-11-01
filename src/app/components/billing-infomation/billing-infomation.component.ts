import { Component, OnInit, Input } from '@angular/core';
import UsStates from "us-state-codes";
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { AuthService } from 'src/app/services/auth.service';
import { HelperService } from 'src/app/services/helper.service';
import { JobService } from 'src/app/services/job.service';
import { MessageService } from 'src/app/services/message.service';
import { SubjectService } from 'src/app/services/subject.service';
import { PaymentService } from 'src/app/services/payment.service';
import { MESSAGE } from 'src/app/constants/message';
import { USER_TYPE } from 'src/app/constants/config';

@Component({
  selector: 'ms-billing-infomation',
  templateUrl: './billing-infomation.component.html',
  styleUrls: ['./billing-infomation.component.scss']
})
export class BillingInfomationComponent implements OnInit {
  formUpdate: FormGroup;
  isLoading: boolean = false;
  listCity: Array<any> = [];
  listState: Array<any> = [];
  listCityStore: any[] = [];
  listZipCode: any[];
  userInfo: UserInfo;
  USER_TYPE = USER_TYPE;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private paymentService: PaymentService,
    private jobService: JobService,
    private subjectService: SubjectService,
    private messageService: MessageService,
    private helperService: HelperService,
  ) { }

  ngOnInit(): void {
    this.jobService.getAllZipCode().subscribe(listZipCode => {
      this.listZipCode = listZipCode;
    })
    this.initForm();
    this.getDataCity();
    this.subjectService.user.subscribe(user => {
      if (!user) return;
      this.userInfo = user;
      if (this.userInfo?.billingInfo) this.bindingData(this.userInfo.billingInfo);
    })
  }

  initForm() {
    this.formUpdate = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      company: [''],
      address_line1: ['', [Validators.required]],
      address_line2: [''],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipcode: ['', [Validators.required]]
    })
  }

  bindingData(data) {
    this.formUpdate.get('firstName').setValue(data.first_name);
    this.formUpdate.get('lastName').setValue(data.last_name);
    this.formUpdate.get('company').setValue(data.company_name || '');
    this.formUpdate.get('address_line1').setValue(data.address_line_1);
    this.formUpdate.get('address_line2').setValue(data.address_line_2 || '');
    this.formUpdate.get('city').setValue(data.city_name);
    this.formUpdate.get('state').setValue(data.state_name);
    this.formUpdate.get('zipcode').setValue(data.zip_code);
  }

  convertData(form) {
    const data = {
      first_name: form.firstName,
      last_name: form.lastName,
      company_name: form.company,
      address_line_1: form.address_line1,
      address_line_2: form.address_line2,
      city_name: form.city || '',
      state_name: form.state || '',
      zip_code: Number.parseInt(form.zipcode),
      isSaveBilling: 1,
      sub_total: 0,
      discount_value: 0,
    }
    return data;
  }

  selectZipcode = (text$: Observable<string>) => {
    return text$.pipe(
      distinctUntilChanged(),
      map(query => {
        return this.helperService.autoCompleteFilter(this.listZipCode, query, 10);
      })
    )
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

  onSubmitChangeInfo() {
    this.helperService.markFormGroupTouched(this.formUpdate);
    if (this.formUpdate.invalid) {
      return;
    }
    const data = this.convertData(this.formUpdate.value);
    this.isLoading = true;
    this.paymentService.getTaxForPayment(data).subscribe(res => {
      this.isLoading = false;
      this.helperService.showToastSuccess(MESSAGE.UPDATE_USER_INFORMATION_SUCCESSFULY);
      this.authService.getUserInfo().subscribe((user) => {});
    }, err => {
      this.isLoading = false;
      this.helperService.showToastError(err);
    })
  }

  cancelData(){
    if (this.userInfo?.billingInfo) this.bindingData(this.userInfo.billingInfo);
    else this.initForm();
  }

}
