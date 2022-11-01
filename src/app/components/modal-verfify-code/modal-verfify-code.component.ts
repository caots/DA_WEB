import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { VERIFY_CODE_LENGTH } from 'src/app/constants/config';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'ms-modal-verfify-code',
  templateUrl: './modal-verfify-code.component.html',
  styleUrls: ['./modal-verfify-code.component.scss']
})

export class ModalVerfifyCodeComponent implements OnInit {
  isCallingApi: boolean;
  formVerify: FormGroup;
  codeLength: number = VERIFY_CODE_LENGTH;
  @Input() phone: string;
  @Output() verifyCode = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private helperService: HelperService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formVerify = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(VERIFY_CODE_LENGTH), Validators.maxLength(VERIFY_CODE_LENGTH)]]
    })
  }

  send(form) {
    this.helperService.markFormGroupTouched(this.formVerify);
    if (this.formVerify.invalid) {
      return;
    }

    this.isCallingApi = true;
    this.verifyCode.emit(form);
  }

  close() {
    this.activeModal.close();
  }  
}
