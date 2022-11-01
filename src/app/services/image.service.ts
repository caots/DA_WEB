import { ElementRef, Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';

import { ModalViewImageComponent } from 'src/app/components/modal-view-image/modal-view-image.component';
import { MessageService} from 'src/app/services/message.service';
import { ModalPreviewFileComponent } from '../components/modal-preview-file/modal-preview-file.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(
    private modalService: NgbModal,
    private messageService: MessageService,
    private httpClient: HttpClient
  ) { }

  addEventClickViewImage() {
    document.querySelectorAll('.image-html').forEach(item => {
      item.parentNode.replaceChild(item.cloneNode(true), item);
    });
    // document.querySelectorAll('.file-preview').forEach(item => {
    //   item.parentNode.replaceChild(item.cloneNode(true), item);
    // });
    this.addEventInitClickViewImage();
  }

  addEventInitClickViewImage() {
    setTimeout(() => {
      document.querySelectorAll('.image-html').forEach(item => {
        item.addEventListener('click', e => {
          this.showModalViewImage(item.querySelector('img').src);
        }, false);
      });
      // document.querySelectorAll('.file-preview').forEach(item => {
      //   item.addEventListener('click', e => {
      //     const urls = item.getElementsByClassName('file-url-hide')[0] as any;
      //     if (!urls || !urls.innerText) { return; }
      //     this.showModalPreviewFileComponent(urls.innerText);
      //   }, false);
      // });
    }, 1500);
  }

  downloadImage(imgUrl) {
    const imgName = imgUrl.substr(imgUrl.lastIndexOf('/') + 1);
    this.httpClient.get(imgUrl, {responseType: 'blob' as 'json'})
      .subscribe((res: any) => {
        const file = new Blob([res], {type: res.type});

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(file);
          return;
        }

        const blob = window.URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = blob;
        link.download = imgName;

        link.dispatchEvent(new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        }));

        setTimeout(() => { // firefox
          window.URL.revokeObjectURL(blob);
          link.remove();
        }, 100);
      });
  }

  showModalViewImage(linkImage): any {
    const modalViewImageRef = this.modalService.open(ModalViewImageComponent, {
      windowClass: 'modal-view-image',
      size: 'xl'
    });

    modalViewImageRef.componentInstance.linkImage = linkImage;
  }
  showModalPreviewFileComponent(content: string): any {
    const modalViewImageRef = this.modalService.open(ModalPreviewFileComponent, {
      windowClass: 'modal-view-image',
      size: 'xl'
    });
    modalViewImageRef.componentInstance.url = content;
  }
}
