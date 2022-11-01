import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ShareButtonsConfig } from 'ngx-sharebuttons';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';

import { JobDetailsComponent } from './job-details.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { JobInfoComponent } from './job-info/job-info.component';
import { CompanyInfoComponent } from './company-info/company-info.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { OtherJobsCardComponent } from './other-jobs-card/other-jobs-card.component';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


const customConfig: ShareButtonsConfig = {
  include: ['facebook', 'twitter'],
  theme: 'modern-light',
  // gaTracking: true,
}

@NgModule({
  declarations: [
    JobDetailsComponent,
    JobInfoComponent,
    CompanyInfoComponent,
    OtherJobsCardComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    ComponentsModule,
    NgImageSliderModule,
    DirectivesModule,
    ShareIconsModule,
    ShareButtonsModule.withConfig(customConfig),
    RouterModule.forChild([{
      path: '',
      component: JobDetailsComponent
    }]),
    FontAwesomeModule
  ]
})

export class JobDetailsModule { }
