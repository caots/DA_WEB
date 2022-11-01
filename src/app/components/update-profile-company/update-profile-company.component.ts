import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { OPTIONS_AVATAR } from 'src/app/constants/config';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ms-update-profile-company',
  templateUrl: './update-profile-company.component.html',
  styleUrls: ['./update-profile-company.component.scss']
})
export class UpdateProfileCompanyComponent implements OnInit {
  @Input() formUpdate: FormGroup
  @Input() listIndustry: string[];
  @Input() ceoPicture: any;
  @Output() onFileChangeMulti = new EventEmitter();
  @Output() ondeleteCompanyPhoto = new EventEmitter();

  OPTIONS_AVATAR = OPTIONS_AVATAR;

  constructor() { }

  ngOnInit(): void {
  }

  fileChangeMulti(event, option){
    this.onFileChangeMulti.emit({event, option})
  }

  deleteCompanyPhoto(){
    this.ondeleteCompanyPhoto.emit();
  }

}
