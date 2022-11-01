import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { BillingHistory } from 'src/app/interfaces/billingHistory'
import { ItemJobCarts } from 'src/app/interfaces/itemJobCarts'
import { CardInfo, CardSettings } from '../interfaces/cardInfo';
import { AssessmentService } from './assessment.service';
import { Assesment } from '../interfaces/assesment';
import { EXPORT_TYPE, PAYMENT_TYPE, CARD_IMAGE, EMPLOYER_PAYMENT } from '../constants/config';
import { MessageService } from 'src/app/services/message.service';
import { AuthService } from 'src/app/services/auth.service';
import { SubjectService } from './subject.service';
import { Coupon } from '../interfaces/coupon';
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  cardImages = CARD_IMAGE;

  constructor(
    private assessmentService: AssessmentService,
    private httpClient: HttpClient,
    private messageService: MessageService,
    private authService: AuthService,
    private subjectService: SubjectService,
  ) { }

  getAllJobInCard(): Observable<ItemJobCarts[]> {
    const url = `${environment.api_url}carts`;
    return this.httpClient.get<ItemJobCarts[]>(url).pipe(map((cards: any) => {
      let results = cards.map(data => {
        return this._mapItemJobCarts(data);
      })
      this.subjectService.listCard.next(results);
      return results;
    }))
  }

  getImageBank(cardInfo: CardInfo) {
    const card = this.cardImages.find(card => card.key === cardInfo.ssl_card_type);
    if (!card) return;
    return card.value;
  }

  getCardInfo(): Observable<CardInfo> {
    const url = `${environment.api_url}payments/card`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      const result = this._mapCardInfo(data);
      this.subjectService.cart.next(result);
      return result;
    }))
  }

  updateCardInfo(data) {
    const url = `${environment.api_url}payments/card`;
    return this.httpClient.put(url, data);
  }

  deleteCard() {
    const url = `${environment.api_url}/payments/card`;
    return this.httpClient.delete(url);
  }

  deleteJobCarts(id) {
    const url = `${environment.api_url}carts/${id}`;
    return this.httpClient.delete(url);
  }

  getSettingsPayment(): Observable<CardSettings> {
    const url = `${environment.api_url}payments/setting`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      const result = this._mapCardSettings(data);
      this.subjectService.settingsCard.next(result);
      return result;
    }))
  }

  getBillingHistory(params): Observable<{ listBillHistory: Array<BillingHistory>, total: number }> {
    const url = `${environment.api_url}payments/history?page=${params.page}&pageSize=${params.size}`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      return {
        total: data.total,
        listBillHistory: data.results.map(item => this._mapBilingHitory(item))
      }
    }))
  }

  confirmPaymentCardUpdate(data: any, ssl_token = null) {
    const cardList = this.getListIdJobCard(data.carts);
    if (ssl_token) { Object.assign(data, { ssl_token: ssl_token }); }
    const isSaveCard = this.subjectService.isSaveCard.value ? 1 : 0;
    Object.assign(data, { isSaveCard }, { carts: cardList});
    // return null;
    const url = `${environment.api_url}payments/employer`;
    return this.httpClient.post(url, data).pipe(map((res: any) => {
      return res;
    }))
  }

  confirmPaymentUpgradeUpdate(data: any, ssl_token = null) {
    let body;
    if(data?.notPayment) {
      body = { jobs: data.jobs, notPayment: 1, coupon: data.coupon };
      body['g-recaptcha-response'] = data['g-recaptcha-response'];
    }
    body = data;
    if (ssl_token) { Object.assign(body, { ssl_token: ssl_token }); }
    const isSaveCard = this.subjectService.isSaveCard.value ? 1 : 0;
    Object.assign(body, { isSaveCard });
    const url = `${environment.api_url}payments/upgradeJob`;
    return this.httpClient.post(url, body).pipe(map((res: any) => {
      return res;
    }))
  }

  confirmPaymentCard(data: any, ssl_token = null) {
    let body;
    if(data?.notPayment) {
      const cardList = this.getListIdJobCard(data.listCarts);
      body = { carts: cardList, notPayment: 1, coupon: data.coupon };
      body['g-recaptcha-response'] = data['g-recaptcha-response'];
    }else{
      const cardList = this.getListIdJobCard(data);
      body = { carts: cardList };
    }
    if (ssl_token) { Object.assign(body, { ssl_token: ssl_token }); }
    const isSaveCard = this.subjectService.isSaveCard.value ? 1 : 0;
    Object.assign(body, { isSaveCard });
    // return null;
    const url = `${environment.api_url}payments/employer`;
    return this.httpClient.post(url, body).pipe(map((res: any) => {
      return res;
    }))
  }
  getListIdJobCard(listCards: ItemJobCarts[]) {
    let result = [];
    listCards && listCards.map(card => {
      if (card.jobSelected) {
        if(card.jobExpiredDays == 1) result.push({ id: card.id, expired_at: card.jobExpiredAt});
        else result.push({ id: card.id });
      }
    })
    return result;
  }

  confirmPaymentJobPrivate(body, ssl_token = null) {
    if (ssl_token) { Object.assign(body, { ssl_token: ssl_token }); }
    const isSaveCard = this.subjectService.isSaveCard.value ? 1 : 0;
    Object.assign(body, { isSaveCard });
    const url = `${environment.api_url}payments/buyMoreEmployer`;
    return this.httpClient.post(url, body).pipe(map((res: any) => {
      return res;
    }))
      
  }

  checkCoupon(data): Observable<{ couponDetail: Coupon, isValid: boolean}> {
    const url = `${environment.api_url}payments/checkCoupon`;
    return this.httpClient.post(url, data).pipe(map((res: any) => {
      return { couponDetail: this._mapCouponDetails(res.couponDetail), isValid: res.isValid}
    }))  
  }

  getTaxForPayment(data): Observable<{ avatax: any, userBillingInfo: any}>{
    const url = `${environment.api_url}payments/getTax`;
    return this.httpClient.post(url, data).pipe(map((res: any) => {
      return {
        avatax: res.avatax,
        userBillingInfo: res.userBillingInfo
      };
    }))  
  }

  confirmPaymentCardJobseeker(data, ssl_token = null) {
    if (data.paymentType !== PAYMENT_TYPE.Topup && data.paymentType !== PAYMENT_TYPE.Credit) data.assessment['id'] = data.assessment.assessmentId;
    if (ssl_token) { Object.assign(data, { ssl_token: ssl_token }); }
    const isSaveCard = this.subjectService.isSaveCard.value ? 1 : 0;
    Object.assign(data, { isSaveCard });
    const url = `${environment.api_url}payments/jobseeker`;
    return this.httpClient.post(url, data).pipe(map((res: any) => {
      return res;
    }))
  }

  confirmPaymentCardEmployer(data, ssl_token = null) {
    if (ssl_token) { Object.assign(data, { ssl_token: ssl_token }); }
    const isSaveCard = this.subjectService.isSaveCard.value ? 1 : 0;
    Object.assign(data, { isSaveCard });
    const url = `${environment.api_url}find-candidate/payment`;
    return this.httpClient.post(url, data).pipe(map((res: any) => {
      return res;
    }))
  }

  exportBillingHistory() {
    const url = `${environment.api_url}payments/export/pdf`;
    return this.httpClient.get(url).subscribe((res: any) => {
      return this.messageService.downloadURI(`${environment.host}${res.filePath}`)
    });
  }

  downloadURI(data, filename, type) {
    filename = type === EXPORT_TYPE.excel ? `${filename}.xlsx` : `${filename}.pdf`;
    const typeBlob = type === EXPORT_TYPE.excel ? "**application/octet-stream**" : "application/pdf";
    var blob = new Blob([data], {
      type: typeBlob
    });
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  }

  redirectToImocha(assessment: Assesment, urlHistory = "") {
    this.assessmentService.takeAssessment(assessment, 0, urlHistory, true).subscribe((res: any) => {
      if (res) {
        const url = res.testUrl;
        window.open(url, '_self');
        this.authService.getUserInfo().subscribe(() => { })
      }
    })
  }

  _mapBilingHitory(data): BillingHistory {
    return {
      createdAt: data.created_at ? new Date(data.created_at) : null,
      description: data.description,
      id: data.id,
      paymentType: data.payment_type,
      products: JSON.parse(data.products),
      sslCardNumber: data.ssl_card_number,
      sslCardType: data.ssl_card_type,
      sslExpDate: data.ssl_exp_date,
      status: data.status,
      totalAmount: data.total_amount,
      updatedAt: data.updated_at ? new Date(data.updated_at) : null,
      userId: data.user_id,
      tax: data.tax,
      discount_value: data.discount_value,
      sub_total: data.sub_total,
      invoice_receipt_url: data.invoice_receipt_url,
      isChecked: false
    } as BillingHistory;
  }

  mathRound(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }

  _mapCardSettings(data): CardSettings {
    return {
      featured_price: data.featured_price ? data.featured_price : null,
      standard_price: data.standard_price ? data.standard_price : null,
      created_at: data.updated_at ? new Date(data.created_at) : null,
      free_assessment_validation: data.free_assessment_validation ? data.free_assessment_validation : null,
      id: data.id,
      is_enable_free_assessment: data.is_enable_free_assessment ? data.is_enable_free_assessment : null,
      nbr_referral_for_one_validation: data.nbr_referral_for_one_validation ? data.nbr_referral_for_one_validation : null,
      standard_validation_price: data.standard_validation_price ? data.standard_validation_price : null,
      top_up: data.top_up ? JSON.parse(data.top_up) : [],
      topup_credit: data.topup_credit ? JSON.parse(data.topup_credit) : [],
      topup_validation_price: data.topup_validation_price ? data.topup_validation_price : null,
      type: data.type,
      updated_at: data.updated_at ? new Date(data.updated_at) : null,
      urgent_hiring_price: this.mathRound(data.urgent_hiring_price),
      private_job_price: this.mathRound(data.private_job_price),
      free_direct_message: data.free_direct_message,
      standard_direct_message_price: data.standard_direct_message_price,
    } as CardSettings;
  }

  _mapCardInfo(data): CardInfo {
    return {
      ssl_account_number: data.ssl_account_number,
      ssl_card_number: data.ssl_account_number,
      ssl_address2: data.ssl_address2,
      ssl_avs_address: data.ssl_avs_address,
      ssl_avs_zip: data.ssl_avs_zip,
      ssl_card_type: data.ssl_card_type,
      ssl_city: data.ssl_city,
      ssl_company: data.ssl_company,
      ssl_country: data.ssl_country,
      ssl_customer_id: data.ssl_customer_id,
      ssl_description: data.ssl_description,
      ssl_email: data.ssl_email,
      ssl_exp_date: data.ssl_exp_date,
      ssl_first_name: data.ssl_first_name,
      ssl_last_name: data.ssl_last_name,
      ssl_phone: data.ssl_phone,
      ssl_result: data.ssl_result,
      ssl_state: data.ssl_state,
      ssl_token: data.ssl_token,
      ssl_token_format: data.ssl_token_format,
      ssl_token_provider: data.ssl_token_provider,
      ssl_token_response: data.ssl_token_response,
      ssl_user_id: data.ssl_user_id
    } as CardInfo;
  }
  _mapCouponDetails(data): Coupon {
    return {
      code: data.code,
      created_at: data.created_at ? new Date(data.created_at) : null,
      discount_acc_type: data.discount_acc_type,
      discount_for: data.discount_for,
      discount_type: data.discount_type,
      discount_value: data.discount_value,
      expired_from: data.expired_from ? new Date(data.expired_from) : null,
      expired_to: data.expired_to ? new Date(data.expired_to) : null,
      expired_type: data.expired_type,
      id: data.id,
      is_for_all_user: data.is_for_all_user,
      is_nbr_user_limit: data.is_nbr_user_limit,
      max_discount_value: data.max_discount_value,
      nbr_used: data.nbr_used,
      remaining_number: data.remaining_number,
      status: data.status,
      updated_at: data.updated_at ? new Date(data.updated_at) : null,
    } as Coupon;
  }

  _mapItemJobCarts(data): ItemJobCarts {
    return {
      createdAt: data.created_at ? new Date(data.created_at) : null,
      employerId: data.employer_id,
      id: data.id,
      jobCreatedAt: data.job_created_at ? new Date(data.job_created_at) : null,
      jobExpiredAt: data.job_expired_at ? new Date(data.job_expired_at) : null,
      jobExpiredDays: data.job_expired_days,
      jobId: data.job_id,
      jobIsDeleted: data.job_is_deleted,
      jobSalary: data.job_salary,
      jobStatus: data.job_status,
      jobTitle: data.job_title,
      jobUpdatedAt: data.job_updated_at ? new Date(data.job_updated_at) : null,
      status: data.status,
      updatedAt: data.updated_at,
      isCheckedHotJob: this.checkJobIsMakeFeatureJob(data),
      jobSelected: true,
      startHotJob: data.job_featured_start_date ? this.convertUtcTimeToLocalTime(data.job_featured_start_date, false) : this.addStartExpiredDays(new Date()),
      endHotJob: data.job_featured_end_date ? this.convertUtcTimeToLocalTime(data.job_featured_end_date, true) : this.addEndExpiredDays(new Date(), data.job_expired_days),
      maxStartHotJob: this.addStartExpiredDays(new Date()),
      maxEndHotJob: this.addEndExpiredDays(new Date(), data.job_expired_days),
      warningDate: null,
      isUrgentHiring: data.job_add_urgent_hiring_badge,
      isPrivate: data.job_is_private,
      privateApplicants: data.job_private_applicants ? data.job_private_applicants : 0
    } as ItemJobCarts;
  }

  checkJobIsMakeFeatureJob(data){
    if(data.job_is_make_featured == 1) return true;
    if(data.job_featured_start_date && data.job_featured_end_date) return true;
    return false;
  }


  convertUtcTimeToLocalTime(date, type) {
    let result = new Date(date);
    if (!type) return result; // true: endDate
    result.setDate(result.getDate());
    result.setHours(23, 59, 59, 999);
    return result;
  }

  addStartExpiredDays(date): Date {
    let result = new Date(date);
    result.setHours(0, 0, 0, 0);
    result.setDate(result.getDate());
    return result;
  }

  addEndExpiredDays(date, days): Date {
    let result = date;
    result.setDate(date.getDate() + days - 1);
    result.setHours(23, 59, 59, 999);
    return result;
  }
}
