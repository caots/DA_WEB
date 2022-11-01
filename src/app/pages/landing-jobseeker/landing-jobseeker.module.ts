import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { LandingJobseekerComponent } from 'src/app/pages/landing-jobseeker/landing-jobseeker.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { SlidersComponent } from './sliders/sliders.component';
import { JobJobseekerComponent } from './job-jobseeker/job-jobseeker.component';
import { SwiperConfigInterface, SwiperModule, SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [
    LandingJobseekerComponent,
    SlidersComponent,
    JobJobseekerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    SwiperModule,
    FontAwesomeModule,
    AngularSvgIconModule.forRoot(),
    RouterModule.forChild([{ 
      path: '', 
      component: LandingJobseekerComponent
    }]),
  ]
})

export class LandingJobseekerModule { }
