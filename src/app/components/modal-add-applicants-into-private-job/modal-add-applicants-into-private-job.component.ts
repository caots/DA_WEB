import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { MESSAGE } from 'src/app/constants/message';
import { CardSettings } from 'src/app/interfaces/cardInfo';
import { Job } from 'src/app/interfaces/job';
import { HelperService } from 'src/app/services/helper.service';
import { PaymentService } from 'src/app/services/payment.service';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'ms-modal-add-applicants-into-private-job',
  templateUrl: './modal-add-applicants-into-private-job.component.html',
  styleUrls: ['./modal-add-applicants-into-private-job.component.scss']
})
export class ModalAddApplicantsIntoPrivateJobComponent implements OnInit {
  @Input() settingsCard: CardSettings;
  @Input() job: Job;
  @Output() close = new EventEmitter();
  @Output() submit = new EventEmitter();
  numberJobseeker: any = 1;
  isLoadingPrivateApplicant: boolean = false;

  constructor(
    private paymentService: PaymentService,
    private helperService: HelperService,
    private subjectService: SubjectService,
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  calcTotalMoney() {
    return this.numberJobseeker * this.settingsCard.private_job_price;
  }

  closeModal(event) {
    this.close.emit(event);
  }

  paymentFreeCart() {
    const data = {
      id: this.job.id,
      private_applicants: this.numberJobseeker
    }
    this.submitPaymentProcess([data]);
  }

  async submitPaymentProcess(data) {
    data = { jobs: data, notPayment: 1};
    this.isLoadingPrivateApplicant = true
    this.paymentService.confirmPaymentJobPrivate(data).subscribe(data => {
      this.isLoadingPrivateApplicant = false
      this.helperService.showToastSuccess(MESSAGE.CONFIRM_PAYEMNT_SUCCESSFULY);
      this.submit.emit();
    }, err => {
      this.helperService.showToastError(err);
      this.isLoadingPrivateApplicant = false
    })
  }
}
