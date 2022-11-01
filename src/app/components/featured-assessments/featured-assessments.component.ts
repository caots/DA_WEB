import { Component, OnInit, Injectable, HostListener, Input } from '@angular/core';
import { get } from 'lodash';

import { Router } from '@angular/router';
import { PAGING, DEVICE_SERVICE, WIDTH_MOBILE, SHOW_ITEM_ASSESSMENT_HOME_PAGE, USER_TYPE, ASSESSMENTS_TYPE, ASSESSMENT_STATUS, PAYMENT_TYPE, CAPTCHA_ACTION, CONFIRM_ASSESSMENT_TEST_NBR_UNAVAIL } from 'src/app/constants/config';
import { Assesment } from 'src/app/interfaces/assesment';
import { JobCategory } from 'src/app/interfaces/jobCategory';
import { PaginationConfig } from 'src/app/interfaces/paginattionConfig';
import { SearchAssessemntHomePage } from 'src/app/interfaces/search';
import { AssessmentService } from 'src/app/services/assessment.service';
import { HelperService } from 'src/app/services/helper.service';
import { SubjectService } from 'src/app/services/subject.service';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { CardInfo } from 'src/app/interfaces/cardInfo';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { PaymentService } from 'src/app/services/payment.service';
import { MESSAGE } from 'src/app/constants/message';
import { AuthService } from 'src/app/services/auth.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { CeoService } from 'src/app/services/ceo.service';

@Component({
  selector: 'ms-featured-assessments',
  templateUrl: './featured-assessments.component.html',
  styleUrls: ['./featured-assessments.component.scss']
})
export class FeaturedAssessmentsComponent implements OnInit {
  @Input() userInfo: UserInfo;
  @Input() isEmployer: boolean;
  listCategory: JobCategory[];
  listAssessment: Assesment[] = [];
  isLoadingAssessment: boolean;
  paginationConfig: PaginationConfig;
  paramsGetListAssessment: SearchAssessemntHomePage;
  maxPageNumber: number;
  titleConfirmPayment: string;
  settingsCard: any;
  cardInfo: CardInfo;
  USER_TYPE = USER_TYPE;
  assessmentData: any;
  urlHistory: string;
  modalPaymentConfirmationRef: NgbModalRef;
  assessmentsConfig = {
    direction: "horizontal",
    slidesPerView: 1,
    keyboard: true,
    scrollbar: false,
    navigation: true,
    pagination: false,
    centeredSlides: false,
    spaceBetween: 0,
    autoplay: false,
    loop: false,
    // breakpoints:{ 
    //   991: { slidesPerView: 3 } ,
    //   667: { slidesPerView: 2 } ,
    // },
  };

  assessmentsConfigEnable = { ...this.assessmentsConfig, mousewheel: true };

  checkDeviceWidth: boolean;
  enableSwipe: boolean = false;
  valueShowAssessment: number;
  currentIndexSwiper: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private helperService: HelperService,
    private modalService: NgbModal,
    private paymentService: PaymentService,
    private assessmentService: AssessmentService,
    private subjectService: SubjectService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private ceoService: CeoService,
    
  ) { }

  // @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   this.checkDeviceWidth = window.innerWidth > WIDTH_MOBILE;
  //   //console.log(window.innerWidth);
  //   //console.log(this.checkDeviceWidth);
  // }

  ngOnInit(): void {
    this.checkDeviceWidth = window.innerWidth > WIDTH_MOBILE;
    this.valueShowAssessment = window.innerWidth > WIDTH_MOBILE ? SHOW_ITEM_ASSESSMENT_HOME_PAGE.DESKTOP : SHOW_ITEM_ASSESSMENT_HOME_PAGE.MOBILE;
    this.paginationConfig = {
      currentPage: 0,
      totalRecord: 0,
      maxRecord: PAGING.MAX_ITEM_HOMEPAGE
    }
    if (this.userInfo) {
      this.subjectService.settingsCard.subscribe(res => {
        this.settingsCard = res;
      });
      this.subjectService.cart.subscribe(cart => {
        this.cardInfo = cart;
      })
    }
    this.subjectService.listCategory.subscribe(category => {
      if (!category) return;

      //this.listCategory = category;
      //if (!this.userInfo || this.userInfo.acc_type == USER_TYPE.JOB_SEEKER) {
      this.listCategory = category.filter(x => x.id != 1);
      //}
    });
    this.paramsGetListAssessment = {
      page: this.paginationConfig.currentPage,
      pageSize: this.paginationConfig.maxRecord,
      categoryId: '',
      isGetFromHomePage: 1
    }
    this.getListAssessment(this.paramsGetListAssessment);
  }

  enableSwipeSlide() {
    this.enableSwipe = true;
  }

  showDetailsAssessment(index) {
    this.listAssessment[index].selectJobStatus = !this.listAssessment[index].selectJobStatus;
  }

  getListAssessment(params) {
    this.isLoadingAssessment = true;
    this.assessmentService.getListAssessment(params).subscribe(data => {
      this.listAssessment = data.listAssessment;
      this.paginationConfig.totalRecord = data.total;
      this.maxPageNumber = Math.ceil(this.paginationConfig.totalRecord / this.paginationConfig.maxRecord);
      this.isLoadingAssessment = false;

      this.listAssessment = this.listAssessment.map(assessment => {
        let categoriesName = [];
        if(assessment.categories && assessment.categories.length > 0){
          assessment.categories.forEach(item => {
            const category = this.listCategory.find(ca => ca.id == item.category_id);
            if(category) categoriesName.push(category.name);
          })
        }
        categoriesName.sort();
        assessment.categoriesName = [...categoriesName];
        return assessment;
      })
      if (this.checkDeviceWidth) this.listAssessment = this.convertDataByDevice(this.listAssessment);
    }, err => {
      this.helperService.showToastError(err);
      this.isLoadingAssessment = false;
    })
  }

  convertDataByDevice(listAssessment: Assesment[], type = DEVICE_SERVICE.DESKTOP) {
    const newListAssessment2D = [];
    while (listAssessment.length) newListAssessment2D.push(listAssessment.splice(0, 3));
    return newListAssessment2D;
  }

  changeSelectCategory(category) {
    this.paramsGetListAssessment.categoryId = category;
    this.paramsGetListAssessment.page = 0;
    this.paramsGetListAssessment.pageSize = PAGING.MAX_ITEM_HOMEPAGE;
    this.currentIndexSwiper = 0;
    this.getListAssessment(this.paramsGetListAssessment);
  }

  goToSignIn() {
    this.router.navigate(['/login']);
  }

  public onIndexChange(numberPage: number) {
    if (this.paramsGetListAssessment.pageSize >= this.paginationConfig.totalRecord) return;
    if (numberPage == this.paramsGetListAssessment.pageSize / SHOW_ITEM_ASSESSMENT_HOME_PAGE.DESKTOP - 1) {
      this.paramsGetListAssessment.pageSize = this.paramsGetListAssessment.pageSize + PAGING.MAX_ITEM_HOMEPAGE;
      this.getListAssessment(this.paramsGetListAssessment);
    }
  }

  previewAssessment(assessment: Assesment) {
    if (assessment.type == ASSESSMENTS_TYPE.IMocha) {
      const params = {
        id: assessment.assessment_id,
        type: assessment.type
      }
      this.assessmentService.getPreviewAssessmentEmployer(params).subscribe(url => {
        window.open(url, '_self');
      }, err => {
        this.helperService.showToastError(err);
      });
    } else {
      this.router.navigate(['/add-custom-assessments'], { queryParams: { id: assessment.assessment_id, isEdit: false } });
    }
  }

  async TakeTestAssessment(assessment: Assesment, modalPaymentConfirmation) {
    const nbrCredits = get(this.userInfo, 'nbrCredits', 0);
    const nbrFreeCredits = get(this.userInfo, 'nbrFreeCredits', 0);
    let numberTest = nbrCredits + nbrFreeCredits;
    assessment.assessmentId = assessment.assessment_id ? assessment.assessment_id : assessment.assessmentId;
    if (numberTest < 1) {
      this.paymentAssessment(assessment, modalPaymentConfirmation);
      return;
    }
    let isConfirmed;
    if (assessment.totalTake) {
      isConfirmed = await this.helperService.confirmPopup(MESSAGE.CONFIRM_RETRY_IMOCHA, MESSAGE.BTN_CONTINUE_TEXT);
    } else {
      isConfirmed = await this.helperService.confirmPopup(MESSAGE.CONFIRM_SWITCH_IMOCHA, MESSAGE.BTN_YES_TEXT);
    }

    if (!isConfirmed) {
      return;
    }
    const isPayment = nbrFreeCredits <= 0;
    this.callTakeValidateService(assessment, isPayment);
  }

  async paymentAssessment(data: Assesment, modalPaymentConfirmation) {
    this.titleConfirmPayment = CONFIRM_ASSESSMENT_TEST_NBR_UNAVAIL;
    const isConfirmed = await this.helperService.confirmPopup(
      this.titleConfirmPayment,
      MESSAGE.BTN_YES_TEXT, MESSAGE.BTN_NO_TEXT);
    if (isConfirmed) {
      this.confirmPaymentAssessment(data, modalPaymentConfirmation);
    }
  }

  confirmPaymentAssessment(data: Assesment, modalPaymentConfirmation) {
    const assesmentTYpe = data.status === ASSESSMENT_STATUS.retry ? PAYMENT_TYPE.RetryValidateTest : PAYMENT_TYPE.ValidateTest;
    let body = {
      paymentType: assesmentTYpe,
      assessment: {
        assessmentId: data.assessmentId ? data.assessmentId : data.assessment_id,
        type: data.type,
        name: data.name
      } as Assesment
    }
    this.assessmentData = body;
    this.modalPaymentConfirmationRef = this.modalService.open(modalPaymentConfirmation, {
      windowClass: 'modal-payment-confirmation',
      size: 'lg'
    });
  }

  generateCaptchaV3() {
    if (this.ceoService.checkLightHouseChorme()) return;
    return this.recaptchaV3Service.execute(CAPTCHA_ACTION.PAYMENT).toPromise();
  }

  async submitPaymentProcess(data) {
    const tokenCaptcha = await this.generateCaptchaV3();
    data['g-recaptcha-response'] = tokenCaptcha;
    this.paymentService.confirmPaymentCardJobseeker(data).subscribe(res => {
      this.helperService.showToastSuccess(MESSAGE.CONFIRM_PAYEMNT_SUCCESSFULY);
      // redirect to IMOCHA
      this.callTakeValidateService(data.assessment, true);
    }, errorRes => {
      this.helperService.showToastError(errorRes);
    })
    this.modalPaymentConfirmationRef.close();
  }


  callTakeValidateService(assessment: Assesment, isPayment = false) {
    const assessmentId = assessment.assessmentId ? assessment.assessmentId : assessment['assessment_id'];
    const jobId = 0;
    this.assessmentService.takeAssessment(assessment, jobId, '', isPayment).subscribe((res: any) => {
      if (res) {
        const url = res.testUrl;
        window.open(url, '_self');
        this.authService.getUserInfo().subscribe(() => { })
      }
    })
  }

}
