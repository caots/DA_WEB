import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { MAX_SIZE_IMAGE_UPLOAD, MIN_SIZE_IMAGE_UPLOAD, SIGN_UP_STEP } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { UserService } from 'src/app/services/user.service';
import { SubjectService } from 'src/app/services/subject.service';
import { HelperService } from 'src/app/services/helper.service';
import { AuthService } from 'src/app/services/auth.service';
import { FileService } from 'src/app/services/file.service';
import { JobService } from 'src/app/services/job.service';
import { PhoneNumberValidator } from 'src/app/directives/phone-number.validator';
import { environment } from 'src/environments/environment';
import { ModalCropCompanyPhotoComponent } from 'src/app/components/modal-crop-company-photo/modal-crop-company-photo.component';

@Component({
  selector: 'ms-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss']
})

export class CompanyInfoComponent implements OnInit {
  @Output() next = new EventEmitter();
  formUpdate: FormGroup;
  userInfo: UserInfo;
  avtFile: File;
  imageChangedEvent: any;
  fileNameSelected: string;
  countryCode: number = 1;
  nameCountry: string;
  isCallingApi: boolean = false;
  isMaxSizeImage: boolean = false;
  listPhoneCountry: Array<any> = environment.nationalPhone;
  listCountry: Array<string> = [];
  listState: Array<string> = [];
  imageChanged: string;
  MAXIMUM_UPLOAD_FILE: string = MESSAGE.MAXIMUM_UPLOAD_FILE;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private subjectService: SubjectService,
    private helperService: HelperService,
    private userService: UserService,
    private authService: AuthService,
    private fileService: FileService,
    private jobService: JobService,
  ) {
    this.fileNameSelected = 'No file selected';
  }

  ngOnInit(): void {
    this.initForm();
    this.getDataCity();
    this.getDataState();
    this.subjectService.user.subscribe(user => {
      if (user) {
        this.userInfo = user;
        const phoneControl = this.formUpdate.get('phone');
        phoneControl.setValidators([PhoneNumberValidator(user.region_code)]);
        phoneControl.updateValueAndValidity();
        this.formUpdate.controls['employer_title'].setValue(user.employer_title);
        this.formUpdate.controls['email'].setValue(user.email);
        this.formUpdate.controls['phone'].setValue(user.phone);
        this.formUpdate.controls['firstName'].setValue(user.firstName);
        this.formUpdate.controls['lastName'].setValue(user.lastName);
        if (user.avatar) {
          this.formUpdate.controls['avtFile'].setValidators([]);
          this.fileNameSelected = '';
        }
        this.nameCountry = user.region_code
      }
    })
  }

  initForm() {
    this.formUpdate = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(/^[\w\._-]+@[a-zA-Z0-9_.-]+?(\.[a-zA-Z0-9_.-]+)+$/)]],
      phone: ['', [PhoneNumberValidator(this.nameCountry)]],
      avtFile: [''],
      employer_title: [''],
    })
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
    modalRef.componentInstance.isCEOAvatar = true;
    modalRef.result.then(res => {
      if (!res) {
        this.imageChanged = null;
        this.fileNameSelected = "";
        return;
      }
      console.log(res.file);
      this.formUpdate.get('avtFile').setValue(res.file);
      this.imageChanged = res.url;
      this.fileNameSelected = res.name;
    })
  }

  selectCountry = (text$: Observable<string>) => {
    return text$.pipe(
      distinctUntilChanged(),
      map(query => {
        return this.helperService.autoCompleteFilter(this.listCountry, query);
      })
    )
  }

  selectState = (text$: Observable<string>) => {
    return text$.pipe(
      distinctUntilChanged(),
      map(query => {
        return this.helperService.autoCompleteFilter(this.listState, query);
      })
    )
  }

  save(form) {
    this.helperService.markFormGroupTouched(this.formUpdate);
    if (this.formUpdate.invalid) {
      return;
    }

    this.isCallingApi = true;
    const formData = new FormData();
    formData.append('email', this.userInfo.email);
    formData.append('first_name', form.firstName);
    formData.append('last_name', form.lastName);
    formData.append('employer_title', form.employer_title || '');
    formData.append('region_code', this.nameCountry);
    formData.append('phone_number', form.phone);
    formData.append('sign_up_step', SIGN_UP_STEP.STEP1.toString());
    if (form.avtFile) {
      formData.append('profile_picture', form.avtFile);
    }
    
    this.userService.updateUser(formData).subscribe(res => {
      this.authService.getUserInfo().subscribe(user => {
        this.next.emit();
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
        this.fileNameSelected = `...${(event.target.files[0].name).slice(-20)}`;
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
    const croppedImage = new File([this.fileService.dataURItoBlob(imageBase64)], nameFile, {
      type: typeFile
    })

    this.setFileUploadHandle(croppedImage, this.imageChangedEvent);
  }

  getDataCity() {
    this.jobService.getAllCountry().subscribe(listCountry => {
      this.listCountry = listCountry;
    })
  }

  getDataState() {
    this.jobService.getAllState().subscribe(listState => {
      this.listState = listState;
    })
  }

  countryChange(country: any) {
    this.countryCode = country.dialCode;
    this.nameCountry = country.iso2;
    const phoneControl = this.formUpdate.get('phone');
    phoneControl.setValidators([PhoneNumberValidator(this.nameCountry)]);
    phoneControl.updateValueAndValidity();
  }
}
