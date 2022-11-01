import {CHAT_GROUP_STATUS} from './../constants/config';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// import urlSlug from 'url-slug';
import slugify from 'slugify';

import { MESSAGE } from 'src/app/constants/message';
import { ModalConfirmComponent } from 'src/app/components/modal-confirm/modal-confirm.component';
import { SEARCH_GROUP_TYPE, USER_TYPE } from '../constants/config';
import { Router } from '@angular/router';
import { SocketMessage } from '../interfaces/message';
import { UserInfo } from '../interfaces/userInfo';
import { CardSettings } from '../interfaces/cardInfo';
import { ItemJobCarts } from '../interfaces/itemJobCarts';

@Injectable({
  providedIn: 'root'
})

export class HelperService {
  constructor(
    private toastr: ToastrService,
    private modalService: NgbModal,
    private router: Router,
  ) { }

  markFormGroupTouched(formGroup) {
    if (this.isIEOrEdge) {
      const controls = formGroup.controls;
      const listControls = [];
      for (let key in controls) {
        listControls.push(controls[key]);
      }

      listControls.forEach(control => {
        control.markAsTouched();
        if (control.controls) {
          this.markFormGroupTouched(control);
        }
      })
    } else {
      (Object as any).values(formGroup.controls).forEach(control => {
        control.markAsTouched();
        if (control.controls) {
          this.markFormGroupTouched(control);
        }
      })
    }
  }

  formatSalary(salary) {
    return salary && salary.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').split('.')[0];
  }

  uniqueArray(arr) {
    return Array.from(new Set(arr))
  }

  showToastSuccess(message, title = '') {
    this.toastr.success(title, message, {
      positionClass: 'toast-bottom-right',
      timeOut: 1500
    });
  }
  showToastToNewMessage(message, title = 'Received a new message', msg: SocketMessage, user: UserInfo) {
    this.toastr.success(message, title, {
      positionClass: 'toast-bottom-right',
      timeOut: 5000
    }) .onTap
    .pipe()
    .subscribe(() => {
      if (!msg || !msg.group_id) { return; }
      const route = user.acc_type == USER_TYPE.EMPLOYER ? '/employer-messages' : '/messages';
      const jobId = msg.job_id
      // this.router.navigate([route, msg.group_id, jobId])
      this.router.navigate([route], {
        queryParams: {
          groupId: msg.group_id,
          searchType: `${CHAT_GROUP_STATUS.All}`,
          isGroup: '0'
        }});
    });
  }

  showToastError(message, title = '') {
    this.toastr.error(title, message, {
      positionClass: 'toast-bottom-right',
      timeOut: 1500
    });
  }

  showToastWarning(message, title = '') {
    this.toastr.warning(title, message, {
      positionClass: 'toast-bottom-right',
      timeOut: 1500
    });
  }

  confirmPopup(
    title: string = 'Do you want to delete this item?',
    btnOkText: string = MESSAGE.BTN_OK_TEXT, btnCancelText: string = MESSAGE.BTN_CANCEL_TEXT
  ) {
    const modalRef = this.modalService.open(ModalConfirmComponent, { windowClass: 'modal-center-screen' });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;
    return modalRef.result;
  }

  confirmPopupDraftPriveJob(
    title: string = 'Would to review/edit your job before proceeding to payment?',
    btnPaymentText: string = 'Proceed to Payment',
    btnOkText: string = 'Review/Edit', 
    btnCancelText: string = MESSAGE.BTN_CANCEL_TEXT
  ) {
    const modalRef = this.modalService.open(ModalConfirmComponent, { windowClass: 'modal-center-screen' });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnPaymentText = btnPaymentText;
    modalRef.componentInstance.btnCancelText = btnCancelText;
    modalRef.componentInstance.isPaymentPrivateDraftJob = true;
    return modalRef.result;
  }

  autoCompleteFilter(list, query, limit = 10) {
    if (query && list && list.length) {
      let listPrioritize = list.filter(item => {
        return item && item.toLowerCase().indexOf(query.toLowerCase()) == 0;
      })

      if (listPrioritize.length >= limit) {
        return listPrioritize.splice(0, limit);
      }

      let listIncludes = list.filter(item => {
        return item && item.toLowerCase().includes(query.toLowerCase()) && !listPrioritize.includes(item);
      })

      return listPrioritize.concat(listIncludes).splice(0, limit);
    }

    return [];
  }

  toggleCaptchaBadge(show) {
    try {
      let el = document.getElementsByTagName('body') as HTMLCollectionOf<HTMLElement>;
      if (el && el.length) {
        if (show) {
          el[0].classList.add('add-captcha-badge');
        } else {
          el[0].classList.remove('add-captcha-badge');
        }
      }
    } catch (error) {
      //console.log(error);
    }
  }

  static padNumber(value: number | null) {
    if (!isNaN(value) && value !== null) {
      return `0${value}`.slice(-2);
    }
    return '';
  }

  isIEOrEdge() {
    return /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
  }

  convertToSlugUrl(title, id) {
    if (title) {
      let titlejob = title.trim().toString().toLowerCase();
      let urlSlice = slugify(`${titlejob}`);
      if (urlSlice.length > 200) {
        urlSlice = urlSlice.slice(0, 200)
        let list: number[] = [];
        for (let i = 0; i < urlSlice.length; i++) {
          if (urlSlice[i] === "-") {
            list.push(i);
          }
        }
        let indexSlice = list[list.length - 2]
        urlSlice = urlSlice.slice(0, Number(indexSlice));
        return slugify(`${urlSlice}-${id}`);
      }
      else {
        return slugify(`${titlejob}-${id}`);
      }
    }
    return id;
  }

  getIdFromSlugUrl(url) {
    const match = url.trim().match(/(\d+$)/);
    if (match) {
      return match[1];
    }

    return null;
  }

  get windowRef() {
    return window;
  }

  getIdVideoYoutube(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11)
      ? match[2]
      : null;
  }
  caclTotalPayCartService(card: ItemJobCarts, settingsCard: CardSettings, isReturnObject = false): any {
    if (!settingsCard) return 0;
    if (card.isPrivate) {
      if (card.privateApplicants == 0 || !card.privateApplicants) card.privateApplicants = 1;
      if(!isReturnObject) {
        return card.privateApplicants * settingsCard.private_job_price;
      }
      return {
        standardJob: card.privateApplicants * settingsCard.private_job_price
      }
    } else {
      const numberHotJob = card.isCheckedHotJob ? this.daysNumberHotJob(card.startHotJob, card.endHotJob) : 0;
      const urgentHiringPrice = card.isUrgentHiring == 1 ? settingsCard.urgent_hiring_price : 0;
      if(!isReturnObject) {
        return numberHotJob * settingsCard.featured_price + card.jobExpiredDays * settingsCard.standard_price + urgentHiringPrice;
      }
      return {
        featuredJob: numberHotJob * settingsCard.featured_price,
        standardJob: card.jobExpiredDays * settingsCard.standard_price,
        urgentHiringPrice: urgentHiringPrice
      }
    }
  }
  confirmPayment(listCard: ItemJobCarts[], settingsCard) {
    let totalPayCard = 0;
    let numberHotJob = 0;
    let numberJobCard = 0;
    let numberExpiredJob = 0;
    listCard.map(card => {
      if (!card.jobSelected) {
        return;
      }
      totalPayCard += this.caclTotalPayCartService(card, settingsCard);
      numberJobCard += 1;
      numberExpiredJob += card.jobExpiredDays;
      card.isCheckedHotJob && (numberHotJob += this.daysNumberHotJob(card.startHotJob, card.endHotJob));
    })
    return {
      totalJob: numberJobCard,
      standardJob: numberExpiredJob,
      featuredJob: numberHotJob,
      totalPrice: totalPayCard
    }
  }

  daysNumberHotJob(startDate, endDate) {
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
  }

}
