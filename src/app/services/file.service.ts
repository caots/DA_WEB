import { Injectable } from '@angular/core';
import { FILE_PREVIEW_TYPE, listFileAcceptMessage, listImageAcceptMessage } from '../constants/config';

@Injectable({
  providedIn: 'root'
})

export class FileService {
  constructor() { }

  dataURItoBlob(dataURI) {
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = unescape(dataURI.split(',')[1]);
    }      

    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    let ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([ia], { type: mimeString });
  }


  // input = /path/path/file-v20-20Jan2021-1612234475607.jpeg
  // output  file-v20-20Jan2021.jpeg
  convertNameOfFile(content) {
    if (!content) {return '';}
    let datas = content.split('/');
    if (!datas.length ) { return content; }
    const fileName = datas[datas.length - 1];
    const firstIndex = content.lastIndexOf('-');
    const lastIndex = content.lastIndexOf('.');
    if (firstIndex >= lastIndex) { return fileName; }
    const timeStamp = content.slice(firstIndex, lastIndex);
    const nameWithoutTimeStamp = fileName.replace(timeStamp, '');
    return nameWithoutTimeStamp;
  }
  getExtentionFile(content) {
    if (!content) {return '';}
    return content.split('.').pop();
  }
  convertExtentionToFaIcon(extention: string) {
    switch (extention) {
      case 'doc':
        return ['far', 'file-word'];
      case 'docx':
        return ['far', 'file-word'];
      case 'xls':
        return ['far', 'file-excel'];
      case 'xlsx':
        return ['far', 'file-excel'];
      case 'ppt':
        return ['far', 'file-powerpoint'];
      case 'pptx':
        return ['far', 'file-powerpoint'];
      case 'pdf':
        return ['far', 'file-pdf'];
      case 'csv':
        return ['fas', 'file-csv'];
      case 'txt':
        return ['far', 'file-alt'];
      case 'mp4':
        return ['far', 'file-video'];
      case 'flv':
        return ['far', 'file-video'];
      case 'mov':
        return ['far', 'file-video'];
      case '3gp':
        return ['far', 'file-video'];
      case 'zip':
        return ['far', 'file-archive'];
      case '7z':
        return ['far', 'file-archive'];
      case 'rar':
        return ['far', 'file-archive'];
      case 'mp3':
        return ['far', 'file-audio'];
      default:
        return ['far', 'file'];
    }
  }
  getFaIconFromLink(content: string) {
    const extention = this.getExtentionFile(content);
    return this.convertExtentionToFaIcon(extention);
  }
  getPreviewType(extentionFile) {
    switch (extentionFile) {
      case 'doc':
        return FILE_PREVIEW_TYPE.office;
      case 'docx':
        return FILE_PREVIEW_TYPE.office;
      case 'xls':
        return FILE_PREVIEW_TYPE.office;
      case 'xlsx':
        return FILE_PREVIEW_TYPE.office;
      case 'ppt':
        return FILE_PREVIEW_TYPE.office;
      case 'pptx':
        return FILE_PREVIEW_TYPE.office;
      case 'pdf':
        return FILE_PREVIEW_TYPE.office;
      case 'csv':
        return FILE_PREVIEW_TYPE.office;
      case 'txt':
        return FILE_PREVIEW_TYPE.office;
      case 'mp3':
        return FILE_PREVIEW_TYPE.mp3;
      case 'mp4':
        return FILE_PREVIEW_TYPE.mp4;
      case 'mov':
        return FILE_PREVIEW_TYPE.mp4;
      case 'flv':
        return FILE_PREVIEW_TYPE.otherVideo;
      case '3gp':
        return FILE_PREVIEW_TYPE.otherVideo;
      case 'zip':
        return FILE_PREVIEW_TYPE.zip;
      case '7z':
        return FILE_PREVIEW_TYPE.zip;
      case 'rar':
        return FILE_PREVIEW_TYPE.zip;
      default:
        return FILE_PREVIEW_TYPE.other;
    }
  }
  isFileImageAccept(type: string, name = '') {
    const extentionFile = this.getExtentionFile(name);
    let whiteFile = ["png", "jpeg", "jpg", "tiff"];
    if (listImageAcceptMessage.includes(type)) {
      return whiteFile.includes(extentionFile);
    }
    return false;
  }
  isFileAcceptMessage(type: string, name = '') {
    if (this.isFileImageAccept(type, name)) { 
      return true; 
    }
    if (!listFileAcceptMessage.includes(type)) {
      const extentionFile = this.getExtentionFile(name);
      if (extentionFile != 'rar' && extentionFile != 'flv' && extentionFile != 'tiff' && extentionFile != 'mkv') { 
        return false;
      }
    }
    return true;
  }
}
