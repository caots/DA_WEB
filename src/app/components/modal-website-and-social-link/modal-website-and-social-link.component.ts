import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { HelperService } from 'src/app/services/helper.service';
@Component({
  selector: 'ms-modal-website-and-social-link',
  templateUrl: './modal-website-and-social-link.component.html',
  styleUrls: ['./modal-website-and-social-link.component.scss']
})
export class ModalWebsiteAndSocialLinkComponent implements OnInit {
  @Input() companyWebsite: string;
  @Input() companyFacebook: string;
  @Input() twitterPage: string;
  urlWebsite: string;
  urlFacebook: string;
  urlTwitter: string;
  formSocialLink: FormGroup;
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private helperService: HelperService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.setData();
  }

  closeModal() {
    this.activeModal.close(false);
  }

  save(form) {
    this.helperService.markFormGroupTouched(this.formSocialLink);
    if (this.formSocialLink.invalid) {
      return;
    }

    let objectUrl = {
      companyWebsite: form.urlWebsite,
      companyFacebook: form.urlFacebook,
      twitterPage: form.urlTwitter
    }
    this.activeModal.close(objectUrl);
  }

  initForm() {
    this.formSocialLink = this.fb.group({
      urlWebsite: ['', [Validators.pattern(/^https?:\/\/[^#?\/]+/)]],
      urlFacebook: ['', [Validators.pattern(/^https?:\/\/[^#?\/]+/)]],
      urlTwitter: ['', [Validators.pattern(/^https?:\/\/[^#?\/]+/)]],
    })
  }

  setData() {
    this.formSocialLink.get('urlWebsite').setValue(this.companyWebsite);
    this.formSocialLink.get('urlFacebook').setValue(this.companyFacebook);
    this.formSocialLink.get('urlTwitter').setValue(this.twitterPage);
  }
}
