import { Component, OnInit } from '@angular/core';
import { SwiperConfigInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'ms-measured-skills',
  templateUrl: './measured-skills.component.html',
  styleUrls: ['./measured-skills.component.scss']
})
export class MeasuredSkillsComponent implements OnInit {
  public config: SwiperConfigInterface = {};

  private pagination: SwiperPaginationInterface = {
    el: '.swiper-pagination',
    clickable: true
  };

  measuredSkillsConfig = {
    direction: "horizontal",
    slidesPerView: 1,
    keyboard: true,
    parallax: true,
    scrollbar: false,
    navigation: false,
    pagination: this.pagination,
    centeredSlides: false,
    spaceBetween: 0,
    autoplay: false,
    observer: true,
    loop: false,
    // breakpoints:{ 
    //   991: { slidesPerView: 3 } ,
    //   667: { slidesPerView: 2 } ,
    // },
  };

  measuredSkillsConfigEnable = { ...this.measuredSkillsConfig, mousewheel: true }

  enableSwipe: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }
  public onIndexChange(index: number) {
  }
  public isAccurateSkillVerification = false;
  public isFindQualityApplicants = true;
  public isManageYourListings = true;
  public isNoTimeWasted = true;
  public isVeryCostEfficient= true;
  public isWeareEEOCCompliant= true;

  enableSwipeSlide(){
    this.enableSwipe = true;
  }
}
