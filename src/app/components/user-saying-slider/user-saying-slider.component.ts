import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SwiperComponent, SwiperDirective } from 'ngx-swiper-wrapper';
import { CONTENT_SAYING_JOBSEEKER, CONTENT_SAYING_EMPLOYER, CONTENT_SAYING } from 'src/app/constants/config';
import { SwiperOptions } from 'swiper';
import { PaginationOptions } from 'swiper/types/components/pagination';
import { ScrollbarOptions } from 'swiper/types/components/scrollbar';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ms-user-saying-slider',
  templateUrl: './user-saying-slider.component.html',
  styleUrls: ['./user-saying-slider.component.scss']
})
export class UserSayingSliderComponent implements OnInit {
  @ViewChild(SwiperComponent, { static: false }) componentRef?: SwiperComponent;
  @Input() isEmployer: boolean;
  @Input() isJobseeker: boolean;
  CONTENT_SAYING: any[];
  private scrollbar: ScrollbarOptions = {
    el: '.swiper-scrollbar',
    hide: false,
    draggable: true
  };

  private pagination: PaginationOptions = {
    el: '.swiper-pagination',
    clickable: true,
    // hideOnClick: false
  };
  public config: SwiperOptions = {
    a11y: { enabled: true },
    direction: 'horizontal',
    slidesPerView: 1,
    centeredSlides: false,
    // spaceBetween: 30,
    loop: true,
    keyboard: true,
    scrollbar: false,
    navigation: false,
    pagination: this.pagination,
    breakpoints: {
      991: { slidesPerView: 5 },
      767: { slidesPerView: 3 },
    },
  };

  API_S3= environment.api_s3;

  configEnable = { ...this.config, mousewheel: true }


  public type: string = 'component';
  disabled = false;
  slides = [1, 2, 3, 4, 5];
  show = true;
  indexSelected: number = 0;
  enableSwipe: boolean = false;
  constructor() { }

  ngOnInit(): void {
    this.CONTENT_SAYING = CONTENT_SAYING;
    if (this.isEmployer){
      this.slides = [6, 7];
      this.config.breakpoints['991'].slidesPerView = 2;
      this.config.breakpoints['767'].slidesPerView = 2;
      this.CONTENT_SAYING = CONTENT_SAYING_EMPLOYER;
    }
    if (this.isJobseeker) {
      this.slides = [2, 3, 4];
      this.config.breakpoints['991'].slidesPerView = 3;
      this.CONTENT_SAYING = CONTENT_SAYING_JOBSEEKER;
      this.config.centeredSlides = true;
      this.configEnable.centeredSlides = true;
    }
  }

  enableSwipeSlide(){
    this.enableSwipe = true;
  }

  public toggleKeyboardControl(): void {
    this.config.keyboard = !this.config.keyboard;
  }

  public toggleMouseWheelControl(): void {
    this.config.mousewheel = !this.config.mousewheel;
  }

  public onIndexChange(index: number): void {
    this.indexSelected = index;
  }
  public selectActive(index: number): void {
    this.indexSelected = index;
  }

  public onSwiperEvent(event: string): void {
  }

}