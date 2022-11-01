import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit } from '@angular/core';
import { ModalPreviewFileComponent } from '../modal-preview-file/modal-preview-file.component';
import { FileService } from 'src/app/services/file.service';
import { Message } from 'src/app/interfaces/message';
import { MessageService } from 'src/app/services/message.service';
import { FILE_PREVIEW_TYPE } from 'src/app/constants/config';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'ms-preview-file',
  templateUrl: './preview-file.component.html',
  styleUrls: ['./preview-file.component.scss']
})
export class MsPreviewFileComponent implements OnInit {
  @Input() message: Message;
  @Input() url: string;
  reviewUrl = 'https://docs.google.com/gview?url=%URL%&embedded=true';
  isLoading: boolean;
  fileName: string;
  faIcon: string[];
  extentionFile: any;
  previewType: number;
  FILE_PREVIEW_TYPE = FILE_PREVIEW_TYPE;
  constructor(
    private modalService: NgbModal, 
    public fileService: FileService, 
    public messageService: MessageService,
    public imageService: ImageService,
    ) { }

  ngOnInit(): void {
    this.isLoading = true;
    if (this.message) {
      this.fileName = this.fileService.convertNameOfFile(this.message.content);
      this.faIcon = this.fileService.getFaIconFromLink(this.message.content);
      this.genPreview();
    }
  }
  showModalPreviewFileComponent(): any {
    if (this.previewType == FILE_PREVIEW_TYPE.other || this.previewType == FILE_PREVIEW_TYPE.mp3 ||
      this.previewType == FILE_PREVIEW_TYPE.zip || this.previewType == FILE_PREVIEW_TYPE.otherVideo) {
      this.imageService.downloadImage(this.url);
      return;
    }
    const modalViewImageRef = this.modalService.open(ModalPreviewFileComponent, {
      windowClass: 'modal-view-image',
      size: 'xl'
    })
    modalViewImageRef.componentInstance.previewType = this.previewType;
    modalViewImageRef.componentInstance.url = this.url;
  }
  loaded(e) {
    this.isLoading = false;
    //console.log(e);
  }
  genPreview() {
    this.extentionFile = this.fileService.getExtentionFile(this.message.content);
    this.previewType = this.fileService.getPreviewType(this.extentionFile);
    // if (this.previewType != FILE_PREVIEW_TYPE.office) {
    //   setTimeout(() => {
    //     this.isLoading = false;
    //   }, 1000);
    // }
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }
  
}
