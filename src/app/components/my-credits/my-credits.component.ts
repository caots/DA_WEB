import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router, NavigationEnd } from "@angular/router";

import { UserService } from 'src/app/services/user.service';
import { HelperService } from 'src/app/services/helper.service';
import { SubjectService } from 'src/app/services/subject.service';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { environment } from 'src/environments/environment';
import { CardInfo } from 'src/app/interfaces/cardInfo';
import { CAPTCHA_ACTION, PAYMENT_TYPE, TAG_EMAIL_CREDITS, TAG_EMAIL_CREDITS_SUBJECT } from 'src/app/constants/config';
import { PaymentService } from 'src/app/services/payment.service';
import { MESSAGE } from 'src/app/constants/message';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { CeoService } from 'src/app/services/ceo.service';
@Component({
  selector: 'ms-my-credits',
  templateUrl: './my-credits.component.html',
  styleUrls: ['./my-credits.component.scss']
})
export class MyCreditsComponent implements OnInit {
  modalTopUpRef: NgbModalRef;
  referLink: string = '';
  @Input() userInfo: UserInfo;
  @Input() settings: any;
  modalPaymentConfirmationRef: NgbModalRef;
  selectTopup: any;
  cardInfo: CardInfo;
  isLoadingBuyCredit: boolean = false;
  TAG_EMAIL_CREDITS_SUBJECT = TAG_EMAIL_CREDITS_SUBJECT;
  TAG_EMAIL_CREDITS = TAG_EMAIL_CREDITS;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private paymentService: PaymentService,
    private userService: UserService,
    private helperService: HelperService,
    private subjectService: SubjectService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private ceoService: CeoService,
  ) { }

  ngOnInit(): void {
    this.selectTopup = {
      name: "Buy 1 Credit",
      num_retake: 1,
      totalPrice: this.settings.standard_validation_price,
    }
    if (this.userInfo.referLink) {
      // this.referLink = `${environment.url_webapp}register?ref=${this.user.referLink}`
      this.referLink = `${environment.url_webapp}register?ref=${encodeURIComponent(this.userInfo.referLink)}`
    } else {
      this.redirect();
    }
    this.subjectService.cart.subscribe(data => {
      this.cardInfo = data;
    })
  }

  showModalTopUp(mdTopUp) {
    this.modalTopUpRef = this.modalService.open(mdTopUp, {
      windowClass: 'modal-top-up',
      size: 'xl'
    })
  }

  redirect() {
    this.userService.getReferLink().subscribe((res: any) => {
      // this.referLink = `${environment.url_webapp}${encodeURIComponent(res.url)}`;
      this.referLink = `${environment.url_webapp}register?ref=${encodeURIComponent(res.refer_link)}`
    }, errorRes => {
      // this.isLoading = false;
      this.helperService.showToastError(errorRes);
    })
  }

  showModalBuyCredit(modalPaymentConfirmation) {
    this.modalPaymentConfirmationRef = this.modalService.open(modalPaymentConfirmation, {
      windowClass: 'modal-payment-confirmation',
      size: 'lg'
    });
  }

  generateCaptchaV3() {
    if (this.ceoService.checkLightHouseChorme()) return;
    return this.recaptchaV3Service.execute(CAPTCHA_ACTION.PAYMENT).toPromise();
  }

  async submitPaymentProcess(topup) {
    let data = {
      paymentType: PAYMENT_TYPE.Credit,
      numRetake: topup.num_retake,
    }
    const tokenCaptcha = await this.generateCaptchaV3();
    data['g-recaptcha-response'] = tokenCaptcha;

    this.isLoadingBuyCredit = true;
    this.paymentService.confirmPaymentCardJobseeker(data).subscribe(res => {
      this.isLoadingBuyCredit = false;
      this.helperService.showToastSuccess(MESSAGE.CONFIRM_PAYEMNT_SUCCESSFULY);
      this.userInfo.nbrCredits += data.numRetake;
      this.subjectService.user.next(this.userInfo);
    }, errorRes => {
      this.isLoadingBuyCredit = false;
      this.helperService.showToastError(errorRes);
    })
    this.modalPaymentConfirmationRef.close()
  }

  copyClipboard() {
    let copyText: any = document.getElementById('refer');
    //console.log(copyText.value)
    copyText.select();
    copyText.setSelectionRange(0, 99999)
    document.execCommand("copy");
  }

  shareUrl(isViaEmail = 0) {
    const url = this.referLink;
    return url;
  }
}
