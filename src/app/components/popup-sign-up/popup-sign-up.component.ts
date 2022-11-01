import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { ASSESSMENT_CUSTOM_CATEGORY, CAPTCHA_ACTION, CUSTOM_ASSESSMENT_ID, CUSTOM_SELECT_ASSESSMENT_ID, USER_TYPE } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { Assesment } from 'src/app/interfaces/assesment';
import { JobCategory } from 'src/app/interfaces/jobCategory';
import { AuthService } from 'src/app/services/auth.service';
import { CeoService } from 'src/app/services/ceo.service';
import { HelperService } from 'src/app/services/helper.service';
import { JobService } from 'src/app/services/job.service';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'ms-popup-sign-up',
  templateUrl: './popup-sign-up.component.html',
  styleUrls: ['./popup-sign-up.component.scss']
})
export class PopupSignUpComponent implements OnInit {
  @Output() close = new EventEmitter();
  formRegister: FormGroup;
  captchaV3Code: string;
  errorMessage: string;
  isCallingApi: boolean = false;
  USER_TYPE = USER_TYPE;
  listCategory: Array<JobCategory>;
  listCategorySearch: Array<JobCategory>;
  listCategorySelected: Array<JobCategory> = [];
  listCategoryRoot: Array<JobCategory>;
  nameCategorySearch: string = '';
  showSearchCategory: boolean = true;

  constructor(
    private ceoService: CeoService,
    private authService: AuthService,
    private fb: FormBuilder,
    private recaptchaV3Service: ReCaptchaV3Service,
    private helperService: HelperService,
    private jobService: JobService,
    private subjectService: SubjectService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.subjectService.listCategory.subscribe(data => {
      if (!data) return;
      const indexCustomAss = data.findIndex(category => category.id == 1);
      if(indexCustomAss >= 0) data.splice(indexCustomAss, 1);
      this.listCategorySearch = data;
      this.listCategoryRoot = data;
    });
  }

  initForm() {
    this.formRegister = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
      ]]
    })
  }

  generateCaptchaV3() {
    if (this.ceoService.checkLightHouseChorme()) return;
    return this.recaptchaV3Service.execute(CAPTCHA_ACTION.LOGIN).toPromise();
  }

  async submit(form) {
    const tokenCaptcha = await this.generateCaptchaV3();
    this.helperService.markFormGroupTouched(this.formRegister);
    if (this.formRegister.invalid) {
      return;
    }

    this.isCallingApi = true;
    let listCategoryId = [];
    if (this.listCategorySelected && this.listCategorySelected.length > 0) {
      this.listCategorySelected.map(ca => listCategoryId.push(ca.id));
    }
    this.authService.signupPotentialsUSer({
      'first_name': form.firstName,
      'last_name': form.lastName,
      'email': form.email.toLowerCase(),
      'categories': listCategoryId,
      'g-recaptcha-response': tokenCaptcha
    }).subscribe((res: any) => {
      this.isCallingApi = false;
      this.helperService.showToastSuccess(MESSAGE.SIGN_UP_SUCCESS);
      this.initForm();
      this.listCategorySelected = [];
      this.listCategorySearch = [];
      this.listCategoryRoot.map(category => {
        category.isSelected = false;
        this.listCategorySearch.push(category);
      });
      this.close.emit();
    }, resError => {
      this.isCallingApi = false;
      this.helperService.showToastError(resError);
    })
  }

  closePopup() {
    this.close.emit();
  }

  onSelectedCategory(category: JobCategory) {
    if (this.listCategorySelected.length >= 5 && !category.isSelected) return;
    category.isSelected = !category.isSelected;
    if (!category.isSelected) {
      const index = this.listCategorySelected.findIndex(c => c.id == category.id);
      if (index >= 0) this.listCategorySelected.splice(index, 1);
    } else {
      this.listCategorySelected.push(category);
    }
    this.listCategorySelected = this.listCategorySelected.sort((a, b) => a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1);
  }


  searchCategorySuggest() {
    this.listCategorySearch = [];
    this.listCategoryRoot.map(category => {
      let check = false;
      if (category.name.toLocaleLowerCase().search(this.nameCategorySearch.toLocaleLowerCase()) > -1) {
        check = true;
        this.listCategorySearch.push(category);
        return;
      }
    })
  }

  removeCategory(category: JobCategory, index) {
    this.showSearchCategory = false;
    this.listCategorySelected.splice(index, 1);
  }

}
