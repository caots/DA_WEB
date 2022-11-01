import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';

import { Observable } from 'rxjs';
import { get, sortBy } from 'lodash';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { MAX_ASSESSMENT_CANDIDATE, WITHIN_MILES, DEFAULT_WITHIN, PAGING, TAB_CANDIDATE, PAYMENT_TYPE, ASSESSMENTS_TYPE, MIN_VALUE_PRICE, CAPTCHA_ACTION } from 'src/app/constants/config';
import UsStates from "us-state-codes";
import { MESSAGE } from 'src/app/constants/message';
import { Assesment } from 'src/app/interfaces/assesment';
import { Candidate } from 'src/app/interfaces/candidate';
import { CardInfo, CardSettings } from 'src/app/interfaces/cardInfo';
import { CitiWithLatLon } from 'src/app/interfaces/job';
import { JobCategory } from 'src/app/interfaces/jobCategory';
import { PaginationConfig } from 'src/app/interfaces/paginattionConfig';
import { SearchCandidate } from 'src/app/interfaces/search';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { CandidateService } from 'src/app/services/candidate.service';
import { HelperService } from 'src/app/services/helper.service';
import { JobService } from 'src/app/services/job.service';
import { PreviousRouteService } from 'src/app/services/previous-route.service';
import { SubjectService } from 'src/app/services/subject.service';
import { PaymentService } from 'src/app/services/payment.service';
import { MessageService } from 'src/app/services/message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { CeoService } from 'src/app/services/ceo.service';
import { ModalConfirmVerificationEmailComponent } from 'src/app/components/modal-confirm-verification-email/modal-confirm-verification-email.component';

@Component({
  selector: 'ms-find-candidates',
  templateUrl: './find-candidates.component.html',
  styleUrls: ['./find-candidates.component.scss']
})
export class FindCandidatesComponent implements OnInit {
  @ViewChild('modalPaymentFree', { static: true }) modalPaymentFree: NgbModalRef;
  listCategory: Array<JobCategory>;
  userInfo: UserInfo;
  listCategoryRoot: Array<JobCategory>;
  listMyAssessment: Array<Assesment> = [];
  isSearchCandidate: boolean = false;
  listAssessmentSelected: Assesment[] = [];
  messageValidateAssessment: string;
  isApplySearchAssessment: boolean = false;
  WITHIN_MILES = WITHIN_MILES;
  DEFAULT_WITHIN = DEFAULT_WITHIN;
  nameAssessmentSearch: string = '';
  querySearch: SearchCandidate;
  paginationConfig: PaginationConfig;
  place: string;
  condition: any;
  autoCompleteData: string[] = [];
  citiesWithLatLon: CitiWithLatLon[];
  listState: string[] = [];
  listCountry: Array<string> = [];
  citiStates: string[];
  isLoadingCandaidate: boolean;
  listCandidate: Array<Candidate>;
  tabActive: string = TAB_CANDIDATE.ALL;
  TAB_CANDIDATE = TAB_CANDIDATE;
  modalInviteCandidateRef: NgbModalRef;
  modalPaymentFreeRef: NgbModalRef;
  modalPaymentConfirmationRef: NgbModalRef;
  candidateToInvite: Candidate;
  creditDM: number;
  settingsCard: CardSettings;
  modalTopUpRef: NgbModalRef;
  cardInfo: CardInfo;
  titleConfirmPayment: string;
  sendDmCandidateData: any;
  isShowMenuAssessmentSelected: boolean = true;
  candidateInfo: Candidate;
  listZipCode: string[];
  dataPaymentFree: any;
  checkVerifiedEmailNUmber: number = 0;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private paymentService: PaymentService,
    private modalService: NgbModal,
    private candidateService: CandidateService,
    private jobService: JobService,
    private helperService: HelperService,
    private subjectService: SubjectService,
    private previousRouteService: PreviousRouteService,
    private location: Location,
    private recaptchaV3Service: ReCaptchaV3Service,
    private ceoService: CeoService,
  ) {
    this.querySearch = new SearchCandidate();
    this.querySearch.within = DEFAULT_WITHIN.id;

    if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras) {
      const state = this.router.getCurrentNavigation().extras.state;
      if (state && state?.neddVerifyEmailEmployer) {
        this.subjectService.user.subscribe(user => {
          if (!user || user.email_verified == 1) return;
          if (this.checkVerifiedEmailNUmber > 0) return;
          this.modalService.open(ModalConfirmVerificationEmailComponent, {
            windowClass: 'modal-crop-company-photo',
            size: 'md'
          });
          this.checkVerifiedEmailNUmber = this.checkVerifiedEmailNUmber + 1;
        })
      }
    }
  }

  ngOnInit(): void {
    this.paginationConfig = {
      currentPage: 0,
      totalRecord: 0,
      maxRecord: PAGING.MAX_ITEM
    }
    this.getCardInfo();
    this.subjectService.user.subscribe(data => {
      if (!data) return;
      this.userInfo = data;
      const user: any = this.userInfo.employer_id > 0 ? this.userInfo.employerInfo : this.userInfo;
      this.creditDM = user.nbrCredits;
    })

    this.subjectService.settingsCard.subscribe(data => {
      if (!data) return;
      this.settingsCard = data;
    })

    this.getDataMaster()
  }

  getDataMaster() {
    this.jobService.getAllCountry().subscribe(listCountry => {
      this.listCountry = listCountry;
      // this.autoCompleteData = this.autoCompleteData.concat(this.listCountry);
    })
    this.jobService.getAllZipCode().subscribe(listZipCode => {
      this.listZipCode = listZipCode;
      this.autoCompleteData = this.autoCompleteData.concat(this.listZipCode);
    });
    this.jobService.getAllState().subscribe(res => {
      this.listState= res;
      this.autoCompleteData = this.autoCompleteData.concat(this.listState);
    })
    this.jobService.getAllCitiesWithLatLon().subscribe(res => {
      this.citiStates = res.map(obj => obj.name);
      this.citiesWithLatLon = res;
      this.autoCompleteData = this.autoCompleteData.concat(this.citiStates);
    });

    this.subjectService.listCategory.subscribe(data => {
      if (!data) return;
      this.listCategory = data;
      this.listCategoryRoot = data;
      this.subjectService.listAssessment.subscribe(data => {
        if (!data) return;
        this.listMyAssessment = data;
        this.mapDataAssessmentToCategory();
        this.checkQueryParams();
      });
    });
  }

  checkQueryParams() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.page) {
        this.paginationConfig.currentPage = Number.parseInt(params.page);
        this.isSearchCandidate = true;
      }
      if (params.onlyBookmark >= 0) {
        this.tabActive = params.onlyBookmark == 0 ? TAB_CANDIDATE.ALL : TAB_CANDIDATE.SHORT_LISTED;
      }
      if (params.assessments) {
        const assessments = JSON.parse(params.assessments);
        assessments.map(ass => {
          let checkFirstAssessmentSelected = false;
          this.listCategory.map((ca, indexCa) => {
            const index = ca.listAssessment.findIndex(assessment => assessment.assessmentId == ass.assessment_id);
            if (index >= 0 && !checkFirstAssessmentSelected) {
              const assessmentSelected = this.listCategory[indexCa].listAssessment[index];
              this.listCategory[indexCa].listAssessment[index] = Object.assign({}, assessmentSelected,
                { point: ass.point, selectedCandidate: true });
              this.listAssessmentSelected.push(this.listCategory[indexCa].listAssessment[index]);
              // disable to assessment duplicate
              const assessment = this.listCategory[indexCa].listAssessment[index];
              if(assessment.categories && assessment.categories.length > 0){
                this.updateDisableAssessment(assessment,  this.listCategory[indexCa]);
              } 
              // update select all category;
              ca.isShowListAssessment = true;
              if (ca.listAssessment.length > 0 && !ca.listAssessment.find(ass => !ass.selectedCandidate)) {
                ca.isSelected = true;
              }
              checkFirstAssessmentSelected = true;
            }
          })
        })
        this.listCategoryRoot = Object.assign([], this.listCategory);
        this.isSearchCandidate = true;
        this.isApplySearchAssessment = true;
      };
      if (params.place) {
        this.place = params.place;
        if (params.city) {
          this.querySearch.city = params.city;
        }
        if (params.state) {
          this.querySearch.state = params.state;
        }
        if (params.zipcode) {
          this.querySearch.zipcode = params.zipcode;
        }
        if (params.location) {
          const locations = params.location.split(',');
          this.querySearch.location = locations;
        }
        if (params.within) this.querySearch.within = params.within;
        this.isSearchCandidate = true;
      }
      if (params.maxCompensation) {
        this.querySearch.salary = params.maxCompensation;
        this.isSearchCandidate = true;
      }


      if (params.jobseekerId) {
        this.querySearch.jobseekerId = params.jobseekerId;
        this.isSearchCandidate = true;
      }
      if (this.isSearchCandidate && location.href.indexOf('find-candidates') >= 0) {
        this.condition = this.getSearchCondition();
        this.getAllCandidate(this.condition);
      }
    });
  }

  getCardInfo() {
    this.paymentService.getCardInfo().subscribe(res => {
      this.cardInfo = res;
    }, errorRes => {
      //console.log(errorRes);
    })
  }


  changeTab(data) {
    this.tabActive = data;
    this.resertData();
    if (this.tabActive == TAB_CANDIDATE.SHORT_LISTED) {
      const condition = this.getSearchCondition();
      this.getAllCandidate(condition);
      this.isSearchCandidate = true;
    }
  }

  resertData() {
    this.isSearchCandidate = false;
    this.isApplySearchAssessment = false;
    this.paginationConfig.currentPage = 0;
    this.place = "";
    this.querySearch.salary = undefined;
    this.listAssessmentSelected = [];
    this.listCandidate = [];
    this.nameAssessmentSearch = '';
    this.paginationConfig.totalRecord = 0;
    this.mapDataAssessmentToCategory();
  }

  selectCountry = (text$: Observable<string>) => {
    return text$.pipe(
      distinctUntilChanged(),
      map(query => {
        return this.helperService.autoCompleteFilter(this.autoCompleteData, query, 10);
      })
    )
  }

  mapDataAssessmentToCategory() {
    if(!this.listMyAssessment || this.listMyAssessment.length <= 0) return;
    this.listCategory.map((category, index) => {
      this.listCategory[index] = { ...category, ...{ listAssessment: [], isShowListAssessment: false, isSelected: false } }
      this.listMyAssessment.map(assessment => {
        if (assessment.categories.some(item => item.category_id == category.id)) {
          assessment = { ...assessment, ...{ selectedCandidate: false, disableDuplicate: false } };
          this.listCategory[index].listAssessment.push(assessment);
        }
      })
    })
    this.listCategoryRoot = Object.assign([], this.listCategory);
  }

  onSelectedAssessemnt(assessment: Assesment, category: JobCategory) {
    const indexAssessment = category.listAssessment.findIndex(ass => ass.assessmentId == assessment.assessmentId);
    if (indexAssessment < 0) return;
    const indexCategory = this.listCategory.findIndex(ca => ca.id == category.id);
    if (indexCategory < 0) return;

    this.listCategory[indexCategory].listAssessment[indexAssessment].selectedCandidate = !assessment.selectedCandidate;
    if (!assessment.selectedCandidate) {
      const index = this.listAssessmentSelected.findIndex(ass => ass.assessmentId == assessment.assessmentId);
      if (index >= 0) this.listAssessmentSelected.splice(index, 1);
      // able to assessment duplicate
      if(assessment.categories && assessment.categories.length > 0) this.updateAbleAssessment(assessment);
    } else {
      this.listAssessmentSelected.push(assessment);
      // disable to assessment duplicate
      if(assessment.categories && assessment.categories.length > 0) this.updateDisableAssessment(assessment, category);
    }
    // update select all category;
    if (!assessment.selectedCandidate && category.isSelected) {
      category.isSelected = false;
    }
    if (category.listAssessment.length > 0 && !category.listAssessment.find(ass => !ass.selectedCandidate)) {
      category.isSelected = true;
    }
    // sort by name
    this.listAssessmentSelected = this.listAssessmentSelected.sort((a, b) => a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1);
  }
  onSelectedCategory(category: JobCategory) {
    category.isSelected = !category.isSelected;
    category.listAssessment.map((assessment) => {
      if (!category.isSelected) {
        if (!assessment.selectedCandidate || assessment.disableDuplicate) { return; }
        assessment.selectedCandidate = false;
        const index = this.listAssessmentSelected.findIndex(ass => ass.assessmentId == assessment.assessmentId);
        if (index >= 0) this.listAssessmentSelected.splice(index, 1);
        // able to assessment duplicate
        if(assessment.categories && assessment.categories.length > 0) this.updateAbleAssessment(assessment);
      } else {
        if (assessment.selectedCandidate || assessment.disableDuplicate) { return; }
        assessment.selectedCandidate = true;
        this.listAssessmentSelected.push(assessment);
        // disable to assessment duplicate
        if(assessment.categories && assessment.categories.length > 0) this.updateDisableAssessment(assessment, category);
      }
    });
    this.listAssessmentSelected = this.listAssessmentSelected.sort((a, b) => a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1);
  }
  SearchAssessmentSuggest() {
    this.listCategory = [];
    this.listCategoryRoot.map(category => {
      let check = false;
      if (category.name.toLocaleLowerCase().search(this.nameAssessmentSearch.toLocaleLowerCase()) > -1) {
        check = true;
        this.listCategory.push(category);
        return;
      }
      category.listAssessment && category.listAssessment.map(assessment => {
        if (assessment.name.toLocaleLowerCase().search(this.nameAssessmentSearch.toLocaleLowerCase()) > -1) check = true
      })
      if (check) this.listCategory.push(category);
    })
  }

  changeWeightAssessment(event, assessment: Assesment) {
    const point = event.target.value;
    const indexCategory = this.listCategory.findIndex(ca => ca.id == assessment.categoryId);
    if (indexCategory < 0) return;
    const indexAssessment = this.listCategory[indexCategory].listAssessment.findIndex(ass => ass.assessmentId == assessment.assessmentId);
    if (indexAssessment >= 0) this.listCategory[indexCategory].listAssessment[indexAssessment].point = Number.parseInt(point);
  }

  removeAssessment(assessment: Assesment, index) {
    const indexCategory = this.listCategory.findIndex(ca => ca.id == assessment.categoryId);
    const indexCategories = [];
    this.listCategory.forEach((ca, index) => {
      if(assessment.categories.some(item => item.category_id == ca.id)) indexCategories.push(index);
    })
    if (indexCategory < 0) return;
    indexCategories.forEach(indexCategory => {
      const indexAssessment = this.listCategory[indexCategory].listAssessment.findIndex(ass => ass.assessmentId == assessment.assessmentId);
      if (indexAssessment >= 0){
        this.listCategory[indexCategory].isSelected = false;
        this.listCategory[indexCategory].listAssessment[indexAssessment].selectedCandidate = false;
        this.listCategory[indexCategory].listAssessment[indexAssessment].point = undefined;
      }
    })
    this.listAssessmentSelected.splice(index, 1);
    // disable to assessment duplicate
    if(assessment.categories && assessment.categories.length > 0) this.updateAbleAssessment(assessment);
  }

  checkValidMarkAssessment() {
    let sumAssessmentPoint = 0;
    this.listAssessmentSelected.forEach(assessent => {
      if (assessent.point) {
        sumAssessmentPoint += assessent.point;
      }
    })
    if (sumAssessmentPoint > 100) {
      this.messageValidateAssessment = MESSAGE.SUM_POINT_TOO_MAX;
      return false;
    }

    if (sumAssessmentPoint < 100 && this.listAssessmentSelected.filter(item => !item.point).length == 0 && sumAssessmentPoint > 0) {
      this.messageValidateAssessment = MESSAGE.SUM_POINT_TOO_MAX;
      return false;
    }
    const markNoPoint = parseInt(parseInt(Number(((100 - Number(sumAssessmentPoint))) / (this.listAssessmentSelected.filter(item => !item.point).length)).toString()).toFixed(0));
    this.listAssessmentSelected.forEach(assessment => {
      if (!assessment.point) {
        assessment.point = markNoPoint;
        sumAssessmentPoint += markNoPoint;
      }
    })
    let numberOfSurplus = 100 - sumAssessmentPoint;

    if (this.listAssessmentSelected.length) {
      for (let i = 0; i <= this.listAssessmentSelected.length; i++) {
        if (numberOfSurplus > 0) {
          this.listAssessmentSelected[i].point = this.listAssessmentSelected[i].point + 1;
          sumAssessmentPoint = sumAssessmentPoint + 1;
          numberOfSurplus = numberOfSurplus - 1;
        } else {
          sumAssessmentPoint = 100;
          break;
        }
      }
    }

    if (this.listAssessmentSelected.find(assessment => assessment.point == 0)) {
      this.messageValidateAssessment = MESSAGE.POINT_EXIST_ZERO;
      return false;
    }

    if (this.listAssessmentSelected.filter(item => !item.point).length > 0) {
      return true;
    }
    if (this.listAssessmentSelected.find(assessment => !assessment.point)) {
      this.messageValidateAssessment = MESSAGE.POINT_EXIST_ZERO;
      return false;
    }

    this.messageValidateAssessment = '';
    return true;
  }

  applySearchAssessemnt() {
    this.isApplySearchAssessment = true;
    this.isShowMenuAssessmentSelected = false;
  }

  searchCandidate() {
    if (!this.checkValidMarkAssessment()) return;
    this.getLocation();
    this.isSearchCandidate = true;
    this.querySearch.jobseekerId = 0;
    this.condition = this.getSearchCondition();
    this.getAllCandidate(this.condition);

  }

  getAllCandidate(condition) {
    this.isLoadingCandaidate = true;
    condition.assessments = encodeURIComponent(condition.assessments);
    const query = this.jobService._convertObjectToQuery(condition);
    this.previousRouteService.replaceStage(`/find-candidates?${query}`);
    condition.assessments = decodeURIComponent(condition.assessments);
    this.candidateService.getListCandidate(condition).subscribe(data => {
      this.listCandidate = data.listCandidate;
      this.paginationConfig.totalRecord = data.total;
      this.isLoadingCandaidate = false;
    }, err => {
      this.isLoadingCandaidate = false;
      this.helperService.showToastError(err);
    })
  }

  getLocation() {
    try {
      if (!this.place) {
        this.updateLocation();
        return;
      }

      const cityStateLatLon = this.citiesWithLatLon.find(obj => obj.name == this.place);
      // if select city and state
      if (cityStateLatLon) {
        const citySateArray = this.place.split(', ');
        const stateName = UsStates.getStateNameByStateCode(citySateArray[1]);
        this.updateLocation(citySateArray[0], stateName, cityStateLatLon.loc);
        return;
      }
      const state = this.listState.find(obj => obj == this.place);
      if (state) {
        this.updateLocation('', state, []);
        return;
      }
      const city = this.listCountry.find(obj => obj == this.place);
      if (city) {
        this.updateLocation(city, '', []);
        return;
      }
      // zipcode
      try {
        const zipcode = parseInt(this.place);
        if (typeof zipcode == 'number') {
          this.updateLocation('', '', [], `${zipcode}`);
        }
      } catch (e) {
        this.updateLocation();
      }
    } catch (e) {
      this.updateLocation();
    }
  }

  updateLocation(city = '', state = '', location = [], zipcode = '') {
    this.querySearch.state = state;
    this.querySearch.city = city;
    this.querySearch.location = location;
    this.querySearch.zipcode = zipcode;
  }

  getSearchCondition() {
    let condition: any = {
      page: this.paginationConfig.currentPage,
      pageSize: this.paginationConfig.maxRecord,
      onlyBookmark: this.tabActive == TAB_CANDIDATE.SHORT_LISTED ? 1 : 0
    }

    if (this.listAssessmentSelected.length > 0) {
      const assessments = [];
      this.listAssessmentSelected.map(assessment => {
        assessments.push({ assessment_id: assessment.assessmentId, point: assessment.point });
      })
      condition.assessments = JSON.stringify(assessments);
      condition.within = this.querySearch.within;
    } else condition.assessments = [];

    if (this.querySearch.salary && this.listAssessmentSelected.length > 0) condition.maxCompensation = this.querySearch.salary;

    if (this.querySearch.location && this.querySearch.location.length == 2 && this.listAssessmentSelected.length > 0) {
      condition.lat = this.querySearch.location[0];
      condition.lon = this.querySearch.location[1];
      condition.location = this.querySearch.location;
    } else {
      condition.lat = '';
      condition.lon = '';
    }
    condition.city = this.querySearch.city;
    condition.state = this.querySearch.state;
    condition.zipcode = this.querySearch.zipcode;
    condition.place = this.place;
    if (this.querySearch.jobseekerId) {
      condition.jobseekerId = this.querySearch.jobseekerId;
    }

    return condition;
  }

  paginationCandidate(page) {
    this.paginationConfig.currentPage = page;
    this.condition = this.getSearchCondition();
    this.getAllCandidate(this.condition);
  }

  bookMark(data) {
    let bookMark = {
      "bookmark": data.bookmarked
    }
    this.candidateService.bookMark(data.id, bookMark).subscribe(res => {
      if (this.tabActive === TAB_CANDIDATE.SHORT_LISTED) {
        this.listCandidate = this.listCandidate.filter(item => {
          return item.id != data.id;
        });
      }
    }, errorRes => {
      this.helperService.showToastError(errorRes);
    });
  }

  showModalInviteJob(candidate: Candidate, modalInviteCandidate) {
    this.candidateToInvite = candidate;
    this.modalInviteCandidateRef = this.modalService.open(modalInviteCandidate, {
      windowClass: 'modal-edit-job',
      size: 'xl'
    })
  }

  openModalTopupDM(modalTopUp) {
    this.modalTopUpRef = this.modalService.open(modalTopUp, {
      windowClass: 'modal-top-up',
      size: 'xl'
    })
  }

  async messageDMCandidate(candidate: Candidate, modalPaymentConfirmation) {
    this.candidateInfo = candidate;
    const nbrCredits = get(this.userInfo, 'nbrCredits', 0);
    const nbrFreeCredits = get(this.userInfo, 'nbrFreeCredits', 0);
    let numberCre = nbrCredits + nbrFreeCredits;
    if (numberCre < 1) {
      //payment
      this.paymentDMCandidate(candidate, modalPaymentConfirmation);
      return;
    }
    this.redirectToMessage(candidate);
  }

  async paymentDMCandidate(data: Candidate, modalPaymentConfirmation) {
    this.titleConfirmPayment = `Your direct message credit has been run out. This direct message will cost you $${this.settingsCard.standard_direct_message_price}. Would you like to continue?`;
    const isConfirmed = await this.helperService.confirmPopup(
      this.titleConfirmPayment,
      MESSAGE.BTN_YES_TEXT, MESSAGE.BTN_NO_TEXT);
    if (isConfirmed) {
      if(this.settingsCard.standard_direct_message_price <= MIN_VALUE_PRICE){
        this.dataPaymentFree = {
          paymentType: PAYMENT_TYPE.BuyDmCandidate,
          numCredit: 1,
          notPayment: 1,
          jobseekerInfo: {
            id: data.id,
            title: data.first_name || '',
            avatar: data.profile_picture || ''
          },
          candidateInfo: this.candidateInfo,
          subTotal: this.settingsCard.standard_direct_message_price,
          discountValue: 0,
        }
        this.showModalConfirmTakeTest()
      }else this.confirmPaymentAssessment(data, modalPaymentConfirmation);
    }
  }

  confirmPaymentAssessment(data: Candidate, modalPaymentConfirmation) {
    let body = {
      paymentType: PAYMENT_TYPE.BuyDmCandidate,
      numCredit: 1,
      jobseekerInfo: {
        id: data.id,
        title: data.first_name || '',
        avatar: data.profile_picture || ''
      },
      candidateInfo: this.candidateInfo,
      subTotal: this.settingsCard.standard_direct_message_price,
      discountValue: 0,
    }
    this.sendDmCandidateData = body;
    this.modalPaymentConfirmationRef = this.modalService.open(modalPaymentConfirmation, {
      windowClass: 'modal-payment-confirmation',
      size: 'lg'
    });
  }


  redirectToMessage(candidate: Candidate) {
    this.candidateService.createGroupChat(candidate).subscribe((data: any) => {
      // data: { companyUpdate: { nbr_credits: 11, nbr_free_credits: 3 }, groupId: 123 }
      // update user
      const newNbrCredirt = data.companyUpdate.nbr_credits || 0;
      const newFreeNbrCredirt = data.companyUpdate.nbr_free_credits || 0;
      if (this.userInfo.employer_id > 0) {
        let employerInfo = this.userInfo.employerInfo;
        employerInfo = Object.assign({}, employerInfo, { nbrCredits: newNbrCredirt, nbrFreeCredits: newFreeNbrCredirt });
        this.userInfo.employerInfo = employerInfo;
      } else {
        this.userInfo = Object.assign({}, this.userInfo, { nbrCredits: newNbrCredirt, nbrFreeCredits: newFreeNbrCredirt });
      }
      this.subjectService.user.next(this.userInfo);
      // redirect to message candidate
      candidate.chat_group_id = data.groupId;
      if (candidate.chat_group_id != null) {
        this.messageService.redirectToDSCandidateCenter(candidate);
      }
    }, err => {
      this.helperService.showToastError(err);
    })
  }

  generateCaptchaV3() {
    if (this.ceoService.checkLightHouseChorme()) return;
    return this.recaptchaV3Service.execute(CAPTCHA_ACTION.PAYMENT).toPromise();
  }
  async submitPaymentProcess(topup) {
    let data = {
      paymentType: PAYMENT_TYPE.BuyDmCandidate,
      numCredit: 1,
      jobseekerInfo: {
        id: this.candidateInfo.id,
        title: this.candidateInfo.first_name || '',
        avatar: this.candidateInfo.profile_picture || ''
      }
    }
    const tokenCaptcha = await this.generateCaptchaV3();
    data['g-recaptcha-response'] = tokenCaptcha;

    this.paymentService.confirmPaymentCardEmployer(data).subscribe((res: any) => {
      //res: groupId
      this.helperService.showToastSuccess(MESSAGE.CONFIRM_PAYEMNT_SUCCESSFULY);
      this.candidateInfo.chat_group_id = res.groupId;
      this.messageService.redirectToDSCandidateCenter(this.candidateInfo);
    }, errorRes => {
      this.helperService.showToastError(errorRes);
    })
    this.modalPaymentConfirmationRef.close()
  }
  goBack() {
    this.location.back();
  }

  checkSelectedListAssessment(category){
    let check = false;
    if(category.isSelected) check = true;
    category.listAssessment.map((assessment, index) => {
      if(!assessment.selectedCandidate){
        category.listAssessment[index].point =undefined;
        return check = false;
      }
    });
    return check;
  }

  showModalConfirmTakeTest() {
    this.modalPaymentFreeRef = this.modalService.open(this.modalPaymentFree, {
      windowClass: 'modal-payment-confirmation',
      size: 'md'
    });
  }

  async takeTestForPaymentFree(){
    this.modalPaymentFreeRef.close();
    const candidateInfo = this.dataPaymentFree.candidateInfo;
    delete this.dataPaymentFree.candidateInfo;
    const tokenCaptcha = await this.generateCaptchaV3();
    this.dataPaymentFree['g-recaptcha-response'] = tokenCaptcha;
    this.paymentService.confirmPaymentCardEmployer(this.dataPaymentFree).subscribe(res => {
      candidateInfo.chat_group_id = res.groupId;
      this.messageService.redirectToDSCandidateCenter(candidateInfo);
    }, err => {
      this.helperService.showToastError(err);
    })
  }

  updateDisableAssessment(assessment: Assesment, ca: JobCategory){
    this.listCategory.forEach((category, i) => {
      if (assessment.categories.some(item => item.category_id == category.id)) {
        const index = category.listAssessment && category.listAssessment.findIndex(as => as.assessmentId == assessment.assessmentId);
        if (index >= 0 && ca.id !== category.id) {
          category.listAssessment[index].disableDuplicate = true;
        }
      }      
    })
  }

  updateAbleAssessment(assessment: Assesment){
    this.listCategory.forEach((category, i) => {
      if (assessment.categories.some(item => item.category_id == category.id)) {
        const index = category.listAssessment && category.listAssessment.findIndex(as => as.assessmentId == assessment.assessmentId);
        if (index >= 0) category.listAssessment[index].disableDuplicate = false;
      }
    })
  }
}
