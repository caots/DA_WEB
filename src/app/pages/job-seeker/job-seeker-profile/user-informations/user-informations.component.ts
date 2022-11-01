import { Observable } from 'rxjs';
import { Router } from "@angular/router";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { environment } from 'src/environments/environment'
import { distinctUntilChanged, map } from 'rxjs/operators';
import { PhoneNumberValidator } from 'src/app/directives/phone-number.validator';
import { MAX_SIZE_IMAGE_UPLOAD, SALARY_TYPE } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { SubjectService } from 'src/app/services/subject.service';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { FileService } from 'src/app/services/file.service';
import { JobService } from 'src/app/services/job.service';
import { ModalCropCompanyPhotoComponent } from 'src/app/components/modal-crop-company-photo/modal-crop-company-photo.component';
import { JobCategory } from 'src/app/interfaces/jobCategory';

@Component({
  selector: 'ms-user-informations',
  templateUrl: './user-informations.component.html',
  styleUrls: ['./user-informations.component.scss']
})
export class UserInformationsComponent implements OnInit {

  formUpdate: FormGroup;
  userInfo: UserInfo;
  countryCode: number = 1;
  nameCountry: string;
  initRegion: string
  isCallingApi: boolean;
  isMaxSizeImage: boolean;
  fileNameSelected: string;
  imageChangedEvent: any;
  croppedImage: File;
  listCity: Array<string> = [];
  listState: Array<string> = [];
  checkChangeEmail: boolean = false;
  textChangEmail: string;
  listPhoneCountry: Array<any> = environment.nationalPhone;
  imageChanged: string;
  MAXIMUM_UPLOAD_FILE: string = MESSAGE.MAXIMUM_UPLOAD_FILE;
  askingSalaryType = SALARY_TYPE;
  isShowCategoryUserPotentials: boolean = false;
  listCategory: Array<JobCategory>;
  listCategorySearch: Array<JobCategory>;
  listCategorySelected: Array<JobCategory> = [];
  listCategoryRoot: Array<JobCategory>;
  nameCategorySearch: string = '';
  showSearchCategory: boolean = true;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private subjectService: SubjectService,
    private helperService: HelperService,
    private userService: UserService,
    private authService: AuthService,
    private fileService: FileService,
    private jobService: JobService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.subjectService.listCategory.subscribe(data => {
      if (!data) return;
      this.listCategorySearch = data;
      this.listCategoryRoot = data;
    });
    this.subjectService.user.subscribe(user => {
      if (user) {
        this.userInfo = user;
        this.setData(this.userInfo);
      }
    })
  }

  setData(user) {
    const phoneControl = this.formUpdate.get('phone');
    phoneControl.setValidators([PhoneNumberValidator(user.region_code)]);
    phoneControl.updateValueAndValidity();
    this.nameCountry = user.region_code;
    this.textChangEmail = user.email;
    this.formUpdate.controls['email'].setValue(user.email);
    this.formUpdate.controls['phone'].setValue(user.phone);
    this.formUpdate.controls['firstName'].setValue(user.firstName);
    this.formUpdate.controls['lastName'].setValue(user.lastName);
    this.formUpdate.controls['benefit'].setValue(user.benefits);
    this.formUpdate.controls['is_subscribe'].setValue(user.is_subscribe == 1);
    this.isShowCategoryUserPotentials = user?.is_user_potentials;
      if (this.isShowCategoryUserPotentials && this.userInfo.user_potentials_categories) {
        setTimeout(() => {
          this.bindCategoryUserPotentials(this.userInfo.user_potentials_categories)
        }, 200);
      }
  }

  bindCategoryUserPotentials(listData: any[]) {
    if (!listData || listData.length == 0) return;
    listData.map(data => {
      this.listCategorySearch.map((ca, index) => {
        if (data?.category_id === ca.id) {
          this.listCategorySearch[index].isSelected = true;
          if (this.listCategorySelected.findIndex(cate => cate.id === ca.id) < 0)
            this.listCategorySelected.push(this.listCategorySearch[index]);
        }
      })
    })
  }

  initForm() {
    this.formUpdate = this.fb.group({
      benefit: [''],
      avtFile: [],
      salaryType: [''],
      phone: ['', [PhoneNumberValidator(this.nameCountry)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, 
        Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)]],
      is_subscribe: ['']
    })
  }

  countryChange(country: any) {
    this.countryCode = country.dialCode;
    this.nameCountry = country.iso2;
    const phoneControl = this.formUpdate.get('phone');
    phoneControl.setValidators([PhoneNumberValidator(this.nameCountry)]);
    phoneControl.updateValueAndValidity();
  }


  onFileChangeAvatar(event) {
    const file = event.target.files[0];
    if (!this.fileService.isFileImageAccept(file.type, file.name)) {
      console.log("file.type: ", file.type);
      this.helperService.showToastError(MESSAGE.WARNING_FILE_NOT_SUPPORT);
      return;
    }
    // if (file.size > MAX_SIZE_IMAGE_UPLOAD) {
    //   this.isMaxSizeImage = true;
    //   this.helperService.showToastError(MESSAGE.WARNING_SIZE_UPLOAD_FILE);
    //   return;
    // }
    const modalRef = this.modalService.open(ModalCropCompanyPhotoComponent, {
      windowClass: 'modal-crop-company-photo',
      size: 'md'
    });
    modalRef.componentInstance.imageChangedEvent = event;
    modalRef.componentInstance.isJobseeker = true;
    modalRef.result.then(res => {
      if (!res) {
        this.imageChanged = null;
        this.fileNameSelected = "";
        return;
      }
      this.formUpdate.get('avtFile').setValue(res.file);
      this.imageChanged = res.url;
      this.fileNameSelected = res.name;
    })
  }

  saveUserInfo(form) {
    this.helperService.markFormGroupTouched(this.formUpdate);
    if (this.formUpdate.invalid) {
      return;
    }

    this.isCallingApi = true;
    const formData = new FormData();
    formData.append('email', this.userInfo.email.toLowerCase());
    formData.append('first_name', form.firstName);
    formData.append('last_name', form.lastName);
    formData.append('phone_number', form.phone);
    formData.append('region_code', this.nameCountry);
    formData.append('is_subscribe', form.is_subscribe ? '1' : '0');
    formData.append('is_user_potentials', this.isShowCategoryUserPotentials ? '1' : '0');
    if (this.listCategorySelected && this.listCategorySelected.length > 0) {
      const listIdCategories = this.listCategorySelected.map(ca => ca.id);
      formData.append('category_user_potentials', listIdCategories.toString());
    }
    // if (form.benefit) {
    //   formData.append('asking_benefits', form.benefit);
    // }

    if (form.avtFile) {
      formData.append('profile_picture', form.avtFile);
    }

    this.userService.updateUser(formData).subscribe(res => {
      this.authService.getUserInfo().subscribe(user => {
        this.isCallingApi = false;
        this.helperService.showToastSuccess(MESSAGE.UPDATE_USER_INFORMATION_SUCCESSFULY);
      })
    }, errorRes => {
      this.isCallingApi = false;
      this.helperService.showToastError(errorRes);
    })
  }


  handleUpload(event) {
    this.imageChangedEvent = event;
    const maxSize = MAX_SIZE_IMAGE_UPLOAD;
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.isMaxSizeImage = false;
      if (file.size > maxSize) {
        this.isMaxSizeImage = true;
        const imageUploadEl: any = document.getElementById('imageUpload');
        imageUploadEl.value = '';
        this.fileNameSelected = 'No file selected';
        this.formUpdate.get('avtFile').setValue(null);
        return;
      }

      this.setFileUploadHandle(file, event);
    } else {
      this.fileNameSelected = 'No file selected';
      this.formUpdate.get('avtFile').setValue(null);
    }
  }

  setFileUploadHandle(file, event) {
    this.formUpdate.get('avtFile').setValue(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const fSelectedLength = (event.target.files[0].name).trim().length;
      if (Number(fSelectedLength) > 30) {
        this.fileNameSelected = '...' + ((event.target.files[0].name).slice(-20));
      } else {
        this.fileNameSelected = event.target.files[0].name;
      }
    }
  }

  cancelImage() {
    this.imageChangedEvent = null;
    this.imageChanged = null;
    this.formUpdate.get('avtFile').setValue(null);
    this.fileNameSelected = this.userInfo.avatar ? '' : 'No file selected';
    const imageUploadEl: any = document.getElementById('imageUpload');
    imageUploadEl.value = '';
  }

  imageCropped(event: ImageCroppedEvent) {
    let imageBase64 = event.base64;
    let nameFile = this.imageChangedEvent.target.files[0].name;
    let typeFile = this.imageChangedEvent.target.files[0].type;
    this.croppedImage = new File([this.fileService.dataURItoBlob(imageBase64)], nameFile, {
      type: typeFile
    })
    this.setFileUploadHandle(this.croppedImage, this.imageChangedEvent);
  }

  cancelUpdateInfo() {
    this.setData(this.userInfo);
  }

  async deleteAccount() {
    const isConfirmed = await this.helperService.confirmPopup(MESSAGE.CONFIRM_DELETE_ACCOUNT);
    if (isConfirmed) {
      const user = this.subjectService.user.value;
      if (user) {
        this.userService.deleteUser(user).subscribe(res => {
          this.helperService.showToastSuccess(MESSAGE.DELETE_ACCOUNT_SUCCESS);
          this.authService.logout();
          this.router.navigate(['/login']);
        }, errorRes => {
          this.helperService.showToastError(errorRes);
        })
      }
    }
  }


  saveChangeEmail() {
    if (this.formUpdate.controls.email.invalid) {
      return;
    }
    if (this.textChangEmail == this.userInfo.email) {
      return;
    }
    this.authService.changeEmail(this.textChangEmail).subscribe(data => {
      this.helperService.showToastSuccess(MESSAGE.UPDATE_EMAIl_SUCCESSFULY);
      this.checkChangeEmail = false;
    }, errorRes => {
      this.helperService.showToastError(errorRes);
    })
  }

  cancelChangeEmail() {
    this.checkChangeEmail = false;
    this.textChangEmail = this.userInfo.email;
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
