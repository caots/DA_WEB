import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from "@angular/router";
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
import { OPTIONS_AVATAR, PERMISSION_TYPE, OTHER_INDUSTRY } from 'src/app/constants/config';
import { MAX_SIZE_IMAGE_UPLOAD, MIN_SIZE_IMAGE_UPLOAD } from 'src/app/constants/config';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { ModalInsertVideoLinkComponent } from 'src/app/components/modal-insert-video-link/modal-insert-video-link.component';
import { ModalWebsiteAndSocialLinkComponent } from 'src/app/components/modal-website-and-social-link/modal-website-and-social-link.component';

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
import { ModalCropCompanyPhotoComponent } from 'src/app/components/modal-crop-company-photo/modal-crop-company-photo.component';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'ms-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss']
})
export class CompanyProfileComponent implements OnInit {
  userInfo: UserInfo;
  formUpdate: FormGroup;
  modalAddWebsiteAndSocialLinkRef: NgbModalRef;
  modalInsertVideoLinkRef: NgbModalRef;
  videoSRC: SafeResourceUrl;
  isUserMember: boolean = false;
  gallery: Array<any> = [];
  videoLink: string;
  listIndustry: string[] = listIndustry;
  OPTIONS_AVATAR = OPTIONS_AVATAR;
  descriptionCompany: any;
  companyWebsite: string;
  companyFacebook: string;
  twitterPage: string;
  companyLocation: string;
  isCallingApi: boolean = false;
  ceoPicture: any;
  linkAudio: any;
  galleryTemp: Array<any> = [];
  permission = PERMISSION_TYPE;
  listCountry: Array<string> = [];
  listState: Array<string> = [];

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private authService: AuthService,
    private fileService: FileService,
    private userService: UserService,
    private helperService: HelperService,
    private subjectService: SubjectService,
    private messageService: MessageService,
    private router: Router,
    private jobService: JobService,
    private sanitizer: DomSanitizer,
    public permissionService: PermissionService
  ) { }

  ngOnInit(): void {
    this.listIndustry.sort(function (a, b) { return a.localeCompare(b) });
    const index = this.listIndustry.findIndex(industry => industry == OTHER_INDUSTRY);
    if (index >= 0) {
      this.listIndustry.splice(index, 1);
      this.listIndustry.push(OTHER_INDUSTRY);
    }
    this.gallery = [
      {
        id: 1,
        name: null,
        type: 'image',
        url: null
      },
      {
        id: 2,
        name: null,
        type: 'image',
        url: null
      },
      {
        id: 3,
        name: null,
        type: 'image',
        url: null
      },
      {
        id: 4,
        type: 'video',
        url: null
      }
    ]
    this.getDataMaster();
    this.initForm();
    this.galleryTemp = cloneDeep(this.gallery);
    this.subjectService.user.subscribe(user => {
      if (user) {
        this.userInfo = user;
        this.isUserMember = this.checkUserMember(user);
        this.setData(this.userInfo);
      }
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  initForm() {
    this.formUpdate = this.fb.group({
      companyProfilePicture: [''],
      companyName: ['', [Validators.required]],
      ceoName: [''],
      employee: [''],
      industry: "",
      revenue: [''],
      address: [''],
      city: [''],
      state: [''],
      descriptionCompany: [''],
      yearFounded: ['', [Validators.pattern(/^\d{4}$/)]],
      employerCompanyUrl: ['', [Validators.pattern(/^[^#?\/]+/)]],
      employerCompanyFacebook: ['', [Validators.pattern(/^https?:\/\/[^#?\/]+/)]],
      employerCompanyTwitter: ['', [Validators.pattern(/^https?:\/\/[^#?\/]+/)]]
    })
  }

  setData(data) {
    let user = data;
    if (this.isUserMember) {
      user = data.employerInfo;
    }
    this.companyLocation = `${user?.address ? `${user?.address}, ` : ''}${user?.cityName}, ${user?.stateName}`;
    this.ceoPicture = user.ceoPicture || '';
    this.companyWebsite = user.companyWebsite || '';
    this.companyFacebook = user.companyFacebook || '';
    this.twitterPage = user.twitterPage || '';
    const companyMinSize = user.companyMinSize !== null ? user.companyMinSize : '';
    const companyMaxSize = user.companyMaxSize !== null ? user.companyMaxSize : '';
    const revenueSizeMin = user.revenueSizeMin !== null ? user.revenueSizeMin : '';
    const revenueSizeMax = user.revenueSizeMax !== null ? user.revenueSizeMax : '';
    this.formUpdate.controls['employerCompanyUrl'].setValue(user.companyWebsite || '');
    this.formUpdate.controls['employerCompanyFacebook'].setValue(user.companyFacebook || '');
    this.formUpdate.controls['employerCompanyTwitter'].setValue(user.twitterPage || '');
    this.formUpdate.controls['companyProfilePicture'].setValue(user.company_profile_picture || '');
    this.formUpdate.controls['companyName'].setValue(user.companyName || '');
    this.formUpdate.controls['ceoName'].setValue(user.ceoName || '');
    this.formUpdate.controls['descriptionCompany'].setValue(user.description || '');
    this.formUpdate.controls['yearFounded'].setValue(user.yearFounded || '');
    this.formUpdate.controls['industry'].setValue(user.industry || '');
    this.formUpdate.controls['city'].setValue(user.cityName || '');
    this.formUpdate.controls['state'].setValue(user.stateName || '');
    this.formUpdate.controls['address'].setValue(user.address);
    this.formUpdate.controls['employee'].setValue(`${companyMinSize}-${companyMaxSize}`);
    this.formUpdate.controls['revenue'].setValue(`${revenueSizeMin}-${revenueSizeMax}`);
    if (user.companyPhoto) {
      this.gallery = JSON.parse(user.companyPhoto);
      const length = this.gallery.length;
      const isHaveVideo = this.gallery.some(e => e.type == 'video');
      this.gallery = [...this.gallery, ...this.galleryTemp.slice(this.gallery.length)];
      if (length < 4) {
        this.gallery[this.gallery.length - 1].type = isHaveVideo ? "image" : "video";
      }

      const indexLast = this.gallery.findIndex(g => g.id == 4 && g.url == "");
      if(indexLast >= 0) this.gallery[indexLast].type = 'video';
    }
    this.videoLink = this.gallery.find(e => e.type == 'video')?.url;
    this.linkAudio = this.videoLink;
    if (this.videoLink) {
      let linkVideo = this.checkVideoYoutube(this.videoLink);
      this.videoSRC = this.sanitizer.bypassSecurityTrustResourceUrl(linkVideo);
      this.gallery.forEach(e => {
        if (e.type == 'video') {
          e.url = this.videoSRC || '';
        }
      })
    }
  }

  checkVideoYoutube(link) {
    if (link && link?.indexOf('//www.youtube.com/watch') >= 0) {
      let id = this.helperService.getIdVideoYoutube(link);
      return `${linkEmbedYoutube}${id}`;
    } else {
      return link;
    }
  }

  checkUserMember(user) {
    return user.employer_id > 0 && user.accountType == 0;
  }

  showModalAddWebSiteAndSocialLink() {
    const modalRef = this.modalService.open(ModalWebsiteAndSocialLinkComponent, {
      windowClass: 'modal-add-website-and-social-link',
      size: 'md'
    })
    modalRef.componentInstance.companyWebsite = this.companyWebsite;
    modalRef.componentInstance.companyFacebook = this.companyFacebook;
    modalRef.componentInstance.twitterPage = this.twitterPage;
    modalRef.result.then(res => {
      this.companyWebsite = res ? res.companyWebsite : this.companyWebsite;
      this.companyFacebook = res ? res.companyFacebook : this.companyFacebook;
      this.twitterPage = res ? res.twitterPage : this.twitterPage;
    }, dismiss => {
      //console.log("Cross Button", dismiss)
    })
  }

  showModalInsertVideoLink({ item, isUrl }) {
    if (item.type != 'video') {
      return;
    }
    const modalRef = this.modalService.open(ModalInsertVideoLinkComponent, {
      windowClass: 'modal-inser-video-link',
      size: 'md'
    })
    modalRef.componentInstance.urlVideo = this.videoLink;
    modalRef.result.then(res => {
      this.gallery.forEach(e => {
        if (e.type == 'video') {
          this.linkAudio = res;
          if (res) {
            let url = res.replace("watch?v=", "embed/")
            e.url = this.sanitizer.bypassSecurityTrustResourceUrl(url)
          } else e.url = '';
        }
      })
    })
  }

  onFileChangeMulti(data) {
    const { event, option, item } = data;
    // if (file.size < MIN_SIZE_IMAGE_UPLOAD) {
    //   this.helperService.showToastError(MESSAGE.WARNING_SIZE_UPLOAD_IMAGE);
    //   return;
    // }
    const file = event.target.files[0];
    if (!this.fileService.isFileImageAccept(file.type, file.name)) {
      console.log("file.type: ", file.type);
      this.helperService.showToastError(MESSAGE.WARNING_FILE_NOT_SUPPORT);
      return;
    }
    let index = item && this.gallery.findIndex(x => x.id == item.id);
    const modalRef = this.modalService.open(ModalCropCompanyPhotoComponent, {
      windowClass: 'modal-crop-company-photo',
      size: 'md'
    })
    modalRef.componentInstance.imageChangedEvent = event;
    modalRef.componentInstance.isCEOAvatar = option == OPTIONS_AVATAR.AVATAR_USER;
    modalRef.result.then(res => {
      if (res) {
        if (option == OPTIONS_AVATAR.AVATAR_USER) {
          this.ceoPicture = res.url;
        } else {
          this.gallery[index].url = res.url;
          this.gallery[index].name = res.fileName;
        }
      }
    })
  }

  save(form) {
    let urlVideo;
    for (let i = 0; i < this.gallery.length; i++) {
      if (this.gallery[i].type == 'video') {
        this.gallery[i].url = this.linkAudio;
        urlVideo = this.gallery[i].url;
      }
      this.gallery[i].id = i + 1;
    }

    this.helperService.markFormGroupTouched(this.formUpdate);
    if (this.formUpdate.invalid) {
      return;
    }

    this.isCallingApi = true;
    let formData = {
      address_line: form.address || '',
      city_name: form.city || '',
      state_name: form.state || '',
      employer_industry: form.industry,
      employer_year_founded: form.yearFounded,
      description: form.descriptionCompany,
      employer_ceo_name: form.ceoName,
      employer_company_url: form.employerCompanyUrl,
      employer_company_facebook: form.employerCompanyFacebook,
      employer_company_twitter: form.employerCompanyTwitter,
      company_size_min: form.employee.split('-')[0] || null,
      company_size_max: form.employee.split('-')[1] || null,
      employer_revenue_min: form.revenue.split('-')[0] || null,
      employer_revenue_max: form.revenue.split('-')[1] || null,
      employer_company_photo: JSON.stringify(this.gallery),
      employer_ceo_picture: this.ceoPicture,
      company_name: form.companyName,
      company_profile_picture: form.companyProfilePicture
    }

    this.userService.updateUserProfile(formData).subscribe(res => {
      this.authService.getUserInfo().subscribe(user => {
        this.isCallingApi = false;
        this.helperService.showToastSuccess(MESSAGE.UPDATE_USER_INFORMATION_SUCCESSFULY);
        this.companyLocation = `${formData?.address_line ? `${formData?.address_line}, ` : ''}${formData.city_name}, ${formData.state_name}`;
      })
    }, errorRes => {
      this.isCallingApi = false;
      this.helperService.showToastError(errorRes);
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

  getDataMaster() {
    this.jobService.getAllCountry().subscribe(listCountry => {
      this.listCountry = listCountry;
    })
    this.jobService.getAllState().subscribe(listState => {
      this.listState = listState;
    })
  }

  cancel() {
    this.setData(this.userInfo);
  }

  async deleteCompanyPhoto(id?: number) {
    const isConfirmed = await this.helperService.confirmPopup(MESSAGE.CONFIRM_DELETE_EMPLOYER_PHOTO, 'Yes');
    if (isConfirmed) {
      const photoItem = this.gallery.find(x => x.id === id);
      if (id === null) {
        this.ceoPicture = "";
      } else if (photoItem) {
        photoItem.url = "";
        photoItem.name = "";
        if(photoItem.id == 4) photoItem.type = 'video';
      }
    }
  }
}
