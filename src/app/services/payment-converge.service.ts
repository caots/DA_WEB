import { UserInfo } from './../interfaces/userInfo';
import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { cloneDeep } from 'lodash';
import { PaymentService } from './payment.service';
import { MESSAGE } from 'src/app/constants/message';
import { HelperService } from 'src/app/services/helper.service';
import { SubjectService } from 'src/app/services/subject.service';
import { CardInfo } from '../interfaces/cardInfo';
import { CAPTCHA_ACTION, EMPLOYER_PAYMENT, JOBSEEKER_PAYMENT_REDIRECT, USER_TYPE } from '../constants/config';
import { AuthService } from './auth.service';
import { MessageService } from './message.service';
import { Router } from '@angular/router';
import { CeoService } from './ceo.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    'Access-Control-Allow-Origin': '*',
    // Accept: 'application/json',
    'Access-Control-Allow-Headers': 'true'
  })
};
declare const PayWithConverge: any;
@Injectable({
  providedIn: 'root'
})

export class PaymentConvergeService {
  paymentObj: any;
  user: UserInfo;
  constructor(
    private router: Router,
    private ceoService: CeoService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private messageService: MessageService,
    private httpClient: HttpClient,
    private paymentService: PaymentService,
    private helperService: HelperService,
    private authService: AuthService,
    private subjectService: SubjectService,
  ) {
    this.paymentObj = {
      ssl_transaction_type: 'ccgettoken',
      ssl_add_token: 'Y',
    }
    this.subjectService.user.subscribe(data => {
      this.user = data;
      this.bindUserInfo();
    });
  }
  bindUserInfo() {
    try {
      if (!this.user || this.user.employerId > 0) { return; }
      const additional = this.user.acc_type == USER_TYPE.JOB_SEEKER ?
        {
          ssl_first_name: this.user.firstName,
          ssl_last_name: this.user.lastName,
          ssl_description: "Job seeker",
        } : {
          ssl_company: this.user.companyName,
          ssl_description: "Employer"
        };
      const user = {
        ...additional,
        ssl_email: this.user.email,
        ssl_customer_id: this.user.id,
        ssl_phone: this.user.phone,
      }
      Object.assign(this.paymentObj, user);
    } catch (e) {
      //console.log(e);
    }
  }
  getPayment(amount: number, payload, type, jobseekerType) {
    const obj = cloneDeep(this.paymentObj);
    Object.assign(obj, { ssl_amount: amount, ssl_avs_address: payload?.address_line_1, ssl_avs_zip: payload?.zip_code });
    // const url = `${environment.converge_host_payment}/transaction_token?${this._convertObjectToQuery(obj)}`;
    // return this.httpClient.post(url, null, { responseType: 'text' }).pipe(map((data: any) => {
    //   this.subjectService.isLoadingCard.next(false);
    //   this.subjectService.hiddenPaymentModal.next(true);
    //   this.openLightbox(data, false, payload, type, jobseekerType);
    // }))
    const url = `${environment.api_url}payments/transaction_token`;
    return this.httpClient.put(url, obj).pipe(map((data: any) => {
      this.subjectService.isLoadingCard.next(false);
      this.subjectService.hiddenPaymentModal.next(true);
      this.openLightbox(data.data, false, payload, type, jobseekerType);
    }))
  }

  updateCard() {
    const obj = cloneDeep(this.paymentObj);
    // const url = `${environment.converge_host_payment}/transaction_token?${this._convertObjectToQuery(obj)}`;
    // return this.httpClient.post(url, null, { responseType: 'text' }).pipe(map((data: any) => {
    //   this.subjectService.isLoadingCard.next(false);
    //   this.openLightbox(data, true, null, null, null);
    // }))
    const url = `${environment.api_url}payments/transaction_token`;
    return this.httpClient.put(url, obj).pipe(map((data: any) => {
        this.subjectService.isLoadingCard.next(false);
        this.openLightbox(data.data, true, null, null, null);
    }))
  }

  openLightbox(txn: string, isUpdateCard = false, payload = null, type, jobseekerType) {
    const paymentFields = {
      ssl_txn_auth_token: txn
    };
    let result;
    const callback = {
      onError: (error) => {
        console.error('onError: ', error);
        this.helperService.showToastError(error);
      },
      onCancelled: () => {
        console.error('onCancelled: ');
      },
      onDeclined: (response) => {
        //console.log('onDeclined: ', response);
        this.helperService.showToastError(response.errorMessage);
      },
      onApproval: (response) => {
        if (isUpdateCard) {
          this.updateCardService(response);
        } else {
          this.updateCardAndPaymentService(response, payload, type, jobseekerType);
        }
        return response;
      }
    };
    new PayWithConverge.open(paymentFields, callback);
    return false;
  }

  updateCardService(response) {
    const body = { ssl_token: response.ssl_token };
    this.paymentService.updateCardInfo(body).subscribe((res: CardInfo) => {
      this.helperService.showToastSuccess(MESSAGE.UPDATE_CARD_INFO_SUCCESSFULY);
      response = Object.assign({}, response, { ssl_card_type: response.ssl_card_short_description })
      this.subjectService.cart.next(response);
    }, err => {
      this.helperService.showToastError(err);
    })
  }

  async updateCardAndPaymentService(response, data, userType: number, paymentType: number) {
    const tokenCaptcha = await this.generateCaptchaV3();
    data['g-recaptcha-response'] = tokenCaptcha;
    if (userType === USER_TYPE.EMPLOYER) {
      if (paymentType == EMPLOYER_PAYMENT.private) {
        this.paymentService.confirmPaymentJobPrivate(data, response.ssl_token).subscribe(res => {
          this.helperService.showToastSuccess(MESSAGE.CONFIRM_PAYEMNT_SUCCESSFULY);
          this.subjectService.isLoadingCard.next(false);
          this.subjectService.checkPaymentAddApplicantsDone.next(true);
          const isSaveCard = this.subjectService.isSaveCard.value;
          if (isSaveCard) {
            this.subjectService.cart.next(response);
          }
        }, err => {
          this.helperService.showToastError(err);
        })
      } else if (paymentType == EMPLOYER_PAYMENT.messageTopup) {
        let candidate = undefined;
        if(data.candidate){
          candidate = data.candidate;
          delete data.candidate;
        }
        this.paymentService.confirmPaymentCardEmployer(data, response.ssl_token).subscribe((res: any) => {
          //analytic
          this.helperService.showToastSuccess(MESSAGE.CONFIRM_PAYEMNT_SUCCESSFULY);
          this.subjectService.isLoadingCard.next(false);
          const isSaveCard = this.subjectService.isSaveCard.value;
          if (isSaveCard)  this.subjectService.cart.next(response);
          this.authService.getUserInfo().subscribe((user) => {});
          this.subjectService.checkPaymentTopupDone.next(true);
          // is message candidate to redirect to message
          if(res.groupId >= 0 && candidate){
            const groupId = res.groupId;
            candidate.chat_group_id = groupId;
            this.messageService.redirectToDSCandidateCenter(candidate);
          }
        }, err => {
          this.helperService.showToastError(err);
        })
      }else if(paymentType == EMPLOYER_PAYMENT.upgrade){
        this.paymentService.confirmPaymentUpgradeUpdate(data).subscribe(res => {       
          this.helperService.showToastSuccess(MESSAGE.CONFIRM_PAYEMNT_SUCCESSFULY);
          this.subjectService.checkPaymentUpgradeDone.next(true);
          this.subjectService.isLoadingCard.next(false);
          const isSaveCard = this.subjectService.isSaveCard.value;
          if (isSaveCard) {
            this.subjectService.cart.next(response);
          }
        }, err => {
          this.helperService.showToastError(err);
        })
      } else {
        this.paymentService.confirmPaymentCardUpdate(data, response.ssl_token).subscribe(res => {       
          this.helperService.showToastSuccess(MESSAGE.CONFIRM_PAYEMNT_SUCCESSFULY);
          this.paymentService.getAllJobInCard();
          this.router.navigate(['/employer-dashboard']);
          this.subjectService.isLoadingCard.next(false);
          this.subjectService.jobsCart.next(data.carts);
          const isSaveCard = this.subjectService.isSaveCard.value;
          if (isSaveCard) {
            this.subjectService.cart.next(response);
          }
        }, err => {
          this.helperService.showToastError(err);
        })
      }
    } else {
      this.paymentService.confirmPaymentCardJobseeker(data, response.ssl_token).subscribe(res => {
        this.helperService.showToastSuccess(MESSAGE.CONFIRM_PAYEMNT_SUCCESSFULY);
        const isSaveCard = this.subjectService.isSaveCard.value;
        this.subjectService.isLoadingCard.next(false);
        if (isSaveCard) {
          this.subjectService.cart.next(response);
        }
        // update user info
        this.authService.getUserInfo().subscribe((user) => {
        }, (error) => { });
        this.subjectService.checkPaymentTopupDone.next(true);
        // redirect to IMOCHA 
        if (paymentType === JOBSEEKER_PAYMENT_REDIRECT.imocha) {
          if (!data.urlHistory) data.urlHistory = '';
          this.paymentService.redirectToImocha(data.assessment, data.urlHistory);
        }
      }, err => {
        this.helperService.showToastError(err);
      })
    }
  }

  generateCaptchaV3() {
    if (this.ceoService.checkLightHouseChorme()) return;
    return this.recaptchaV3Service.execute(CAPTCHA_ACTION.PAYMENT).toPromise();
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

}
