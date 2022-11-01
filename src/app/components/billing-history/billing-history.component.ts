import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { USER_TYPE, PAYMENT_TYPE_HISTORY, PAYMENT_TYPE } from 'src/app/constants/config';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { BillingHistory } from 'src/app/interfaces/billingHistory';
import { ItemJobCarts } from 'src/app/interfaces/itemJobCarts';
import { PaymentService } from 'src/app/services/payment.service';
import * as moment from 'moment';
import { CardSettings } from 'src/app/interfaces/cardInfo';
import { HelperService } from 'src/app/services/helper.service';
import { MessageService } from 'src/app/services/message.service';
import { SubjectService } from 'src/app/services/subject.service';
@Component({
  selector: 'ms-billing-history',
  templateUrl: './billing-history.component.html',
  styleUrls: ['./billing-history.component.scss']
})

export class BillingHistoryComponent implements OnInit {
  @Input() dataBillings: any[];
  @Input() hiddenTitle: boolean;
  @Input() shoppingCard: boolean;
  @Input() type: number;
  @Input() isDetail: boolean;
  @Input() settingsCard: CardSettings;
  @Output() exportBillingHistory = new EventEmitter();
  @Output() close = new EventEmitter();
  serviceType: string;
  userType = USER_TYPE;
  paymentType = PAYMENT_TYPE;
  dFrom: NgbDateStruct;
  dTo: NgbDateStruct;
  d = new Date();
  date = moment(new Date()).format('MM/DD/YYYY');
  isHideDetail: boolean = false;
  PAYMENT_TYPE = PAYMENT_TYPE;
  listCheckedBillingDownload: any[] = [];

  //products: "{"num_retake":1}"
  //products: "[{"id":324,"avatar":""}]"
  constructor(
    private subjectService: SubjectService,
    public paymentService: PaymentService,
    public helperService: HelperService,
    public messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.subjectService.settingsCard.subscribe(data => this.settingsCard = data);
    if (this.type === USER_TYPE.JOB_SEEKER) {
      this.dataBillings.map(bill => {
        let key = bill.paymentType.toString();
        bill['serviceType'] = PAYMENT_TYPE_HISTORY[key];
        if (!bill.products.num_retake) {
          bill['description'] = bill.products[0].title;
        } else {
          bill['description'] = `${bill.products.num_retake} retakes`;
        }
      })
    } else {
      this.dataBillings.map((bill, index) => {
        this.dataBillings[index] = Object.assign({}, bill, { isDetails: false })
      })
    }
    console.log(this.dataBillings);

  }

  closeModal() {
    this.close.emit();
  }

  formatDateBill(date: Date) {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  }

  formatDateJobPaid(date, isEndDate = false) {
    if (!date) return;
    const arrayDate = date.split(' ') as any[];
    if (!arrayDate || arrayDate.length == 0) {
      return;
    }
    const resultDate = arrayDate[0].replace(/-/g, '/');
    const resultArrayDate = resultDate.split('/');
    const dayJobPatd = isEndDate ? resultArrayDate[2] - 1 : resultArrayDate[2];
    return `${resultArrayDate[1]}/${dayJobPatd}/${resultArrayDate[0]}`;
  }

  formatDateFeatureJob(date, type) {
    if (!date) return;
    //if (!type) {
      date = new Date(date);
      return `${this.padNumber(date.getMonth() + 1)}/${this.padNumber(date.getDate())}/${date.getFullYear()}`
    //}
    const arrayDate = date.split('T') as any[];
    if (!arrayDate || arrayDate.length == 0) {
      return;
    }
    const resultDate = arrayDate[0].replace(/-/g, '/');
    const resultArrayDate = resultDate.split('/');
    return `${resultArrayDate[1]}/${resultArrayDate[2]}/${resultArrayDate[0]}`;
  }

  totalPriceJob(featuredPrice, standardPrice) {
    if (!featuredPrice) featuredPrice = 0;
    if (!standardPrice) standardPrice = 0;
    return featuredPrice + standardPrice;
  }

  padNumber(value: number | null) {
    if (!isNaN(value) && value !== null) {
      return `0${value}`.slice(-2);
    }
    return '';
  }

  totalPrice(totalNumberPrice, totalHotJob, totalUrgentHiring) {
    return Number.parseInt(totalNumberPrice) + totalHotJob + totalUrgentHiring;
  }

  totalUrgentHiring(urgentHiring, price) {
    if (urgentHiring == 1) return price;
    return 0;
  }

  caclPayCard(card: ItemJobCarts): number {
    return this.helperService.caclTotalPayCartService(card, this.settingsCard);
  }

  totalCard(dataBillings) {
    let temp;
    for (let i = 0; i < dataBillings.length; i++) {
      temp += this.caclPayCard(dataBillings[i])
      return temp;
    }
  }

  caclTotalPayCard(): number {
    let result = 0;
    this.dataBillings.map(card => {
      if (!card.jobSelected) return 0;
      result += this.caclPayCard(card);
    })
    return result;
  }

  totalNumberPrice(a, b) {
    let temp: number = a * b;
    return temp.toFixed(2);
  }

  totalHotJob(a, b) {
    const numberHotJob = a.isCheckedHotJob ? this.helperService.daysNumberHotJob(a.startHotJob, a.endHotJob) : 0
    return numberHotJob * b;
  }

  subtractDate(day) {
    return moment(this.date, 'MM/DD/YYYY').add(day, 'days');
  }

  formatDate(a) {
    return moment(a).format('MM/DD/YYYY');
  }

  hideDetail(billing = undefined) {
    this.isHideDetail = !this.isHideDetail;
    if (billing) {
      const bill = this.dataBillings.find(x => x.id == billing.id);
      bill.isDetails = !bill.isDetails;
    }
  }

  addJobExpiredDays(jobCart, isStartJob) {
    let result = new Date(jobCart.jobCreatedAt);
    if (!isStartJob) result.setDate(result.getDate() + jobCart.jobExpiredDays - 1);
    return moment(result).format('MM/DD/YYYY');
  }

  checkDownloadBilling(billing, index) {
    billing.isChecked = !billing.isChecked;
    if (!billing.isChecked) {
      this.listCheckedBillingDownload = this.listCheckedBillingDownload.filter(bill => bill.id !== billing.id);
    } else this.listCheckedBillingDownload.push(billing);
  }

  onExportBillingHistory() {
    //this.exportBillingHistory.emit();
    if (this.listCheckedBillingDownload.length > 0) {
      this.listCheckedBillingDownload.map(billing => {
        if (billing.invoice_receipt_url) {
          this.messageService.downloadURI(billing.invoice_receipt_url);
        }
      })
    }
  }

}

