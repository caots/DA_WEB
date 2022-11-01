import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from 'src/app/services/file.service';
import { UserService } from 'src/app/services/user.service';
import { HelperService } from '../../services/helper.service';
import { UPLOAD_TYPE, SIZE_IMAGE_JOBSEEKER, SIZE_IMAGE_EMPLOYER, SIZE_IMAGE_COMPANY, SIZE_ZOOM_IMAGE_EMPLOYER, SIZE_ZOOM_IMAGE_JOBSEEKER, SIZE_ZOOM_IMAGE_COMPANY_LOGO } from 'src/app/constants/config';
import { ImgCropperConfig, ImgCropperErrorEvent, ImgCropperEvent, LyImageCropper, LyImageCropperModule } from '@alyle/ui/image-cropper';

@Component({
  selector: 'ms-modal-crop-company-photo',
  templateUrl: './modal-crop-company-photo.component.html',
  styleUrls: ['./modal-crop-company-photo.component.scss']
})
export class ModalCropCompanyPhotoComponent implements OnInit {
  fileNameSelected: string;
  fileCropped: File;
  @Input() imageChangedEvent: any;
  @Input() companyLogo: boolean;
  @Input() isJobseeker: boolean;
  @Input() isCEOAvatar: boolean;
  @Input() handleSubmit: (FormData, success: (any) => void, fail: (string) => void) => object;
  imageRatio: number;
  isUploading: boolean;
  transform: ImageTransform = {};
  scale: number = 1;
  ready: boolean;
  minScale: number;
  @ViewChild(LyImageCropper, { static: true }) cropper: LyImageCropper;
  cropConfig: ImgCropperConfig = {
    width: SIZE_IMAGE_EMPLOYER.width,
    height: SIZE_IMAGE_EMPLOYER.height,
    keepAspectRatio: true,
    responsiveArea: true,
    output: {
      width: SIZE_ZOOM_IMAGE_EMPLOYER.width,
      height: SIZE_ZOOM_IMAGE_EMPLOYER.height
    },
    resizableArea: false,
    extraZoomOut: true,
    fill: '#fff'

  };

  onReady(e: ImgCropperEvent) {
    this.ready = true;
  }


  onLoaded(e: ImgCropperEvent) {
    const nameFile = e.name;
    const fSelectedLength = nameFile.trim().length;
    if (fSelectedLength > 30) {
      this.fileNameSelected = `...${nameFile.slice(-20)}`;
    } else {
      this.fileNameSelected = nameFile;
    }
  }

  constructor(
    public activeModal: NgbActiveModal,
    private fileService: FileService,
    private userService: UserService,
    private helperService: HelperService
  ) { }

  ngOnInit(): void {
    if (this.isCEOAvatar || this.isJobseeker) {
      const output = {
        width: SIZE_ZOOM_IMAGE_JOBSEEKER.width,
        height: SIZE_ZOOM_IMAGE_JOBSEEKER.height
      }
      this.cropConfig = Object.assign({}, this.cropConfig, {
        width: SIZE_IMAGE_JOBSEEKER.width,
        output: output
      });
    } else if (this.companyLogo) {
      const output = {
        width: SIZE_ZOOM_IMAGE_COMPANY_LOGO.width,
        height: SIZE_ZOOM_IMAGE_COMPANY_LOGO.height
      }
      this.cropConfig = Object.assign({}, this.cropConfig,
        {
          width: SIZE_IMAGE_COMPANY.width,
          height: SIZE_IMAGE_COMPANY.height,
          output: output
        });
    }
    //this.imageRatio = this.isCEOAvatar || this.isJobseeker ? 1 / 1 : 8 / 4;
    this.transform.scale = this.scale;
    this.cropper.selectInputEvent(this.imageChangedEvent)
  }

  imageCropped(event: ImgCropperEvent) {
    const imageBase64 = event.dataURL;
    const nameFile = event.name;
    const typeFile = event.type;
    const croppedImage = new File([this.fileService.dataURItoBlob(imageBase64)], nameFile, {
      type: typeFile
    })
    this.fileCropped = croppedImage;
    this.save();
  }

  closeModal() {
    this.activeModal.close(false);
  }

  save() {
    if (this.fileCropped) {
      this.isUploading = true;
      const fileName = this.fileCropped.name;
      const formData: FormData = new FormData();
      formData.append('file', this.fileCropped);
      if (this.isCEOAvatar || this.isJobseeker) {
        formData.append('uploadType', UPLOAD_TYPE.EmployerAvatar);
      } else {
        formData.append('uploadType', this.companyLogo ? UPLOAD_TYPE.CompanyAvatar : UPLOAD_TYPE.EmployerPhoto);
      }

      if (this.handleSubmit != null) {
        this.handleSubmit(formData, (res: any) => {
          this.isUploading = false;
          this.activeModal.close({
            file: this.fileCropped,
            url: res.url,
            name: fileName
          });
        },
          (errorRes) => {
            this.helperService.showToastError(errorRes);
          })
        return;
      }

      this.userService.uploadImage(formData).subscribe(
        (res: any) => {
          this.isUploading = false;
          this.activeModal.close({
            file: this.fileCropped,
            url: res.url,
            name: fileName
          });
        },
        (errorRes) => {
          this.helperService.showToastError(errorRes);
        }
      );
    }
  }

  zoomInOut(scale) {
    this.scale = this.minScale + (scale / 500);
    // this.scale = (scale / 500);
  }
}
