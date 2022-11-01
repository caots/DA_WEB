import { Component, OnInit } from '@angular/core';
import { SwiperConfigInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'ms-how-measuredskills-compares',
  templateUrl: './how-measuredskills-compares.component.html',
  styleUrls: ['./how-measuredskills-compares.component.scss']
})
export class HowMeasuredskillsComparesComponent implements OnInit {
  public config: SwiperConfigInterface = {};

  private pagination: SwiperPaginationInterface = {
    el: '.swiper-pagination',
    clickable: true
  };
  constructor() { }

  ngOnInit(): void {
  }
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
  };
  public onIndexChange(index: number) {
  }

}
