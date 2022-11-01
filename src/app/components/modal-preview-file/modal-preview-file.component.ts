import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FILE_PREVIEW_TYPE } from 'src/app/constants/config';
import { FileService } from 'src/app/services/file.service';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'ms-modal-preview-file',
  templateUrl: './modal-preview-file.component.html',
  styleUrls: ['./modal-preview-file.component.scss']
})
export class ModalPreviewFileComponent implements OnInit {
  @Input() url: any;
  @Input() previewType: number;

  reviewUrl = 'https://docs.google.com/gview?url=%URL%&embedded=true';
  isLoading: boolean;
  extentionFile: any;
  message: any;
  FILE_PREVIEW_TYPE = FILE_PREVIEW_TYPE;
  constructor(
    private activeModal: NgbActiveModal,
    public imageService: ImageService,
    public fileService: FileService, 
    ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.genPreview();
  }
  closeModal() {
    this.activeModal.close(false);
  }
  loaded(e) {
    this.isLoading = false;
    //console.log(e);
  }
  genPreview() {
    if (this.previewType != FILE_PREVIEW_TYPE.office) {
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    }
  }
}
