import { Router } from "@angular/router";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PhoneNumberValidator } from 'src/app/directives/phone-number.validator';

import { MESSAGE } from 'src/app/constants/message';
import { listIndustry } from 'src/app/constants/config';
import { linkEmbedYoutube } from 'src/app/constants/config';
import { COMPANY_PHOTOS, PERMISSION_TYPE, MIN_SIZE_IMAGE_UPLOAD } from 'src/app/constants/config';
import { MAX_SIZE_IMAGE_UPLOAD } from 'src/app/constants/config';
import { ModalCropCompanyPhotoComponent } from 'src/app/components/modal-crop-company-photo/modal-crop-company-photo.component';

import { UserInfo } from 'src/app/interfaces/userInfo';
import { environment } from 'src/environments/environment';
import { FileService } from 'src/app/services/file.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { JobService } from 'src/app/services/job.service';
import { HelperService } from 'src/app/services/helper.service';
import { SubjectService } from 'src/app/services/subject.service';
import { MessageService } from 'src/app/services/message.service';
import { PermissionService } from 'src/app/services/permission.service';
import UsStates from "us-state-codes";


@Component({
  selector: 'ms-company-information',
  templateUrl: './company-information.component.html',
  styleUrls: ['./company-information.component.scss']
})
export class CompanyInformationComponent implements OnInit {
  userInfo: UserInfo;
  formUpdate: FormGroup;
  imageChangedEvent: any;
  isMaxSizeImage: boolean = false;
  fileNameSelected: string;
  isCallingApi: boolean = false;
  companyPhoto: any = [];
  avtFile: File;
  countryCode: number = 1;
  nameCountry: string;
  initRegion: string
  linkImgFirst: string;
  linkImgSecond: string;
  linkImgThird: string;
  gallery: any;
  photoName1: string;
  photoName2: string;
  photoName3: string;
  ceoPicture: string;
  ceoPictureName: string;
  ceoName: string;
  companyWebsite: string;
  companyFacebook: string;
  twitterPage: string;
  videoLink: string;
  videoSRC: SafeResourceUrl;
  listIndustry: string[] = listIndustry;
  isUserMember: boolean = false;
  permission = PERMISSION_TYPE;
  checkChangeEmail: boolean = false;
  textChangEmail: string;
  listPhoneCountry: Array<any> = environment.nationalPhone;
  checkChangeVideo: boolean = false;
  listCity: Array<any> = [];
  listZipCode: Array<string> = [];
  listState: Array<any> = [];
  imageChanged: string;
  textWarningStateRequire: string = MESSAGE.WARNING_STATE_REQUIRED;
  checkStateValid: boolean = false;
  MAXIMUM_UPLOAD_FILE: string = MESSAGE.MAXIMUM_UPLOAD_FILE;
  listCityStore: any[] = [];

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private authService: AuthService,
    private fileService: FileService,
    private userService: UserService,
    private helperService: HelperService,
    private subjectService: SubjectService,
    private messageService: MessageService,
    private router: Router,
    private jobService: JobService,
    private sanitizer: DomSanitizer,
    public permissionService: PermissionService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.subjectService.user.subscribe(user => {
      if (user) {
        this.userInfo = user;
        this.isUserMember = this.checkUserMember(user);
        this.setData(this.userInfo);
      }
    })
    //this.getDataMaster()
  }



  checkUserMember(user) {
    if(user.employer_id > 0 && user.accountType == 0){
      return true;
    }
    return false;
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
    modalRef.componentInstance.isCEOAvatar = event;
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

  setData(data) {
    let user = data; 
    const phoneControl = this.formUpdate.get('phone');
    phoneControl.setValidators([PhoneNumberValidator(user.region_code)]);
    phoneControl.updateValueAndValidity();
    this.nameCountry = user.region_code;
    this.textChangEmail = user.email;
    this.formUpdate.controls['firstName'].setValue(user.firstName);
    this.formUpdate.controls['lastName'].setValue(user.lastName);
    this.formUpdate.controls['employer_title'].setValue(user.employer_title || '');
    this.formUpdate.controls['phone'].setValue(user.phone);
    this.formUpdate.controls['email'].setValue(user.email);
    this.formUpdate.controls['city'].setValue(user.cityName);
    this.formUpdate.controls['state'].setValue(user.stateName);
    this.formUpdate.controls['is_subscribe'].setValue(user.is_subscribe == 1);
    // this.formUpdate.controls['address'].setValue(user.address);
    // this.formUpdate.controls['zipcode'].setValue(user.zip_code);
    if (user.avatar) {
      this.formUpdate.controls['avtFile'].setValidators([]);
    }
  }

  initForm() {
    this.formUpdate = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      employer_title: [''],
      phone: ['', [PhoneNumberValidator(this.nameCountry)]],
      email: ['', [Validators.required, Validators.pattern(/^[\w\._-]+@[a-zA-Z0-9_.-]+?(\.[a-zA-Z0-9_.-]+)+$/)]],
      address: [''],
      city: [''],
      state: [''],
      avtFile: [''],
      zipcode: [''],
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

  save(form) {
    this.helperService.markFormGroupTouched(this.formUpdate);
    if (this.formUpdate.invalid) {
      return;
    }
    this.isCallingApi = true;
    const formData = new FormData();
    if (form.avtFile) {
      formData.append('profile_picture', form.avtFile);
    }
    formData.append('first_name', form.firstName);
    formData.append('last_name', form.lastName);
    formData.append('employer_title', form.employer_title);
    formData.append('is_subscribe', form.is_subscribe ? '1' : '0');
    formData.append('phone_number', form.phone);
    formData.append('region_code', this.nameCountry);
    //formData.append('address_line', form.address);
    // formData.append('city_name', form.city);
    // formData.append('state_name', form.state);
    //formData.append('zip_code', form.zipcode)
    
    this.userService.updateUser(formData).subscribe(res => {
      this.authService.getUserInfo().subscribe(user => {
        this.companyPhoto = [];
        this.isCallingApi = false;
        this.cancelImage();
        this.helperService.showToastSuccess(MESSAGE.UPDATE_USER_INFORMATION_SUCCESSFULY);
        this.fileNameSelected = '';
      })
    }, errorRes => {
      this.isCallingApi = false;
      this.helperService.showToastError(errorRes);
    })
  }

  cancelUpdate() {
    this.cancelImage();
    this.fileNameSelected = '';
    this.setData(this.userInfo);
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
        this.fileNameSelected = `...${(event.target.files[0].name).slice(-20)}`;
      } else {
        this.fileNameSelected = event.target.files[0].name;
      }
    }
  }

  cancelImage() {
    this.formUpdate.get('avtFile').setValue(null);
    this.fileNameSelected = this.userInfo.avatar ? '' : 'No file selected';
    this.imageChangedEvent = null;
    this.imageChanged = null;
    const imageUploadEl: any = document.getElementById('imageUpload');
    imageUploadEl.value = '';
  }

  imageCropped(event: ImageCroppedEvent) {
    let imageBase64 = event.base64;
    let nameFile = this.imageChangedEvent.target.files[0].name;
    let typeFile = this.imageChangedEvent.target.files[0].type;
    const croppedImage = new File([this.fileService.dataURItoBlob(imageBase64)], nameFile, {
      type: typeFile
    })
    this.setFileUploadHandle(croppedImage, this.imageChangedEvent);
  }

  onFileChangeMulti(event, options) {
    // if (file.size < MIN_SIZE_IMAGE_UPLOAD) {
    //   this.helperService.showToastError(MESSAGE.WARNING_SIZE_UPLOAD_IMAGE);
    //   return;
    // }
    const file = event.target.files[0];
    if (!this.fileService.isFileAcceptMessage(file.type, file.name)) {
      console.log("file.type: ", file.type);
      this.helperService.showToastError(MESSAGE.WARNING_FILE_NOT_SUPPORT);
      return;
    }
    let imgUpload = event.target.files[0];
    if (imgUpload) {
      let fileName = event.target.files[0].name;
      const formData: FormData = new FormData();
      formData.append('file', imgUpload);
      formData.append('uploadType', "img");
      this.userService.uploadImage(formData).subscribe(res => {
        if (options === 'first') {
          this.linkImgFirst = res['url'];
          this.photoName1 = fileName
        }
        if (options === 'second') {
          this.linkImgSecond = res['url'];
          this.photoName2 = fileName
        }
        if (options === 'third') {
          this.linkImgThird = res['url'];
          this.photoName3 = fileName
        }
        if (options === 'ceo-picture') {
          this.ceoPicture = res['url'];
          this.ceoPictureName = fileName
        }
      }, errorRes => {
        this.helperService.showToastError(errorRes);
      })

    }

  }

  // onChangeCompanyInfo(data) {
  //   if(this.videoLink == ''){
  //     this.checkChangeVideo = false;
  //   }else if (data === 'video') {
  //     this.checkChangeVideo = true;
  //     if(this.messageService.checkIsUrl(this.videoLink)){
  //       let linkVideo = this.checkVideoYoutube(this.videoLink);
  //       this.videoSRC = this.sanitizer.bypassSecurityTrustResourceUrl(linkVideo);
  //     }else{
  //       this.videoSRC = null;
  //     }
  //   }
  // }

  async deleteAccount() {
    const isConfirmed = await this.helperService.confirmPopup(MESSAGE.CONFIRM_DELETE_ACCOUNT, 'Yes');
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
      this.authService.logout();
      this.router.navigate(['/login']);
    }, errorRes => {
      this.helperService.showToastError(errorRes);
    })
  }

  cancelChangeEmail() {
    this.checkChangeEmail = false;
    this.textChangEmail = this.userInfo.email;
  }

  selectZipcode = (text$: Observable<string>) => {
    return text$.pipe(
      distinctUntilChanged(),
      map(query => {
        return this.helperService.autoCompleteFilter(this.listZipCode, query);
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

  // getDataCity(code = '') {
  //   this.listCityStore = [];
  //   this.jobService.getAllCity().subscribe(listCity => {
  //     this.listCityStore = listCity;
  //     this.getDataState();
  //   });
  // }

  // getDataState() {
  //   this.jobService.getAllState().subscribe(listState => {
  //     this.listState = listState;
  //     const index = this.listState.findIndex(state => state == this.userInfo.stateName);
  //     if (index >= 0) {
  //       const code = UsStates.getStateCodeByStateName(this.listState[index]);
  //       this.listCity = this.listCityStore.filter(res => res.adminCode == code);
  //     }
  //   })
  // }

  // getDataMaster() {
  //   this.getDataCity();
  //   this.jobService.getAllZipCode().subscribe(listZipCode => {
  //     this.listZipCode = listZipCode;
  //   })
  // }

}
