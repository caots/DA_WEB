import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { MESSAGE } from 'src/app/constants/message';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { HelperService } from 'src/app/services/helper.service';
import { environment } from 'src/environments/environment';
import { ModalCropCompanyPhotoComponent } from 'src/app/components/modal-crop-company-photo/modal-crop-company-photo.component';
import { JobService } from 'src/app/services/job.service';
import UsStates from "us-state-codes";
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'ms-update-information-company',
  templateUrl: './update-information-company.component.html',
  styleUrls: ['./update-information-company.component.scss']
})
export class UpdateInformationCompanyComponent implements OnInit {
  @Input() isCompanySettings: boolean;
  @Input() userInfo: UserInfo;
  @Input() formUpdate: FormGroup;
  @Input() gallery: Array<any> = [];
  @Input() companyWebsite: string;
  @Input() companyFacebook: string;
  @Input() twitterPage: string;
  listCity: Array<any> = [];
  listState: Array<any> = [];
  @Output() onShowModalAddWebSiteAndSocialLink = new EventEmitter();
  @Output() onDrop = new EventEmitter();
  @Output() onShowModalInsertVideoLink = new EventEmitter();
  @Output() onDeleteCompanyPhoto = new EventEmitter();
  @Output() fileChangeMulti = new EventEmitter();

  fileNameSelected: string;
  imageChanged: string;
  MAXIMUM_UPLOAD_FILE: string = MESSAGE.MAXIMUM_UPLOAD_FILE;
  isMaxSizeImage: boolean = false;
  listCityStore: any[] = [];

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      [{ 'header': 1 }, { 'header': 2 }], // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
      [{ 'direction': 'rtl' }], // text direction
      [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'], // remove formatting button
      ['link'], // link and image, video
    ]
  };

  constructor(
    private jobService: JobService,
    private modalService: NgbModal,
    private helperService: HelperService,
    private fileService: FileService,
  ) {
    this.fileNameSelected = 'No file selected';
  }

  ngOnInit(): void {
    if (this.userInfo?.company_profile_picture) this.fileNameSelected = '';
    this.getDataCity();
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
    modalRef.componentInstance.companyLogo = true;

    modalRef.result.then(res => {
      if (!res) {
        this.imageChanged = null;
        this.fileNameSelected = "";
        return;
      }
      this.formUpdate.get('companyProfilePicture').setValue(res.url);
      this.imageChanged = res.url;
      this.fileNameSelected = res.name;
    })
  }

  cancelImage() {
    this.imageChanged = null;
    this.formUpdate.get('companyProfilePicture').setValue(null);
    this.fileNameSelected = this.userInfo.company_profile_picture ? '' : 'No file selected';
    const imageUploadEl: any = document.getElementById('imageUpload');
    imageUploadEl.value = '';
  }

  showModalInsertVideoLink(item, status) {
    this.onShowModalInsertVideoLink.emit({ item, status })
  }

  onFileChangeMulti(event, item) {
    this.fileChangeMulti.emit({ event, item })
  }

  drop(event) {
    this.onDrop.emit(event);
  }

  deleteCompanyPhoto(item) {
    this.onDeleteCompanyPhoto.emit(item);
  }

  showModalAddWebSiteAndSocialLink() {
    this.onShowModalAddWebSiteAndSocialLink.emit();
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

  getDataCity(code = '') {
    this.listCityStore = [];
    this.jobService.getAllCity().subscribe(listCity => {
      this.listCityStore = listCity;
      this.getDataState();
    });
  }

  getDataState() {
    this.jobService.getAllState().subscribe(listState => {
      this.listState = listState;
      const index = this.listState.findIndex(state => state == this.userInfo?.stateName);
      if (index >= 0) {
        const code = UsStates.getStateCodeByStateName(this.listState[index]);
        this.listCity = this.listCityStore.filter(res => res.adminCode == code);
      }
    })
  }
}

