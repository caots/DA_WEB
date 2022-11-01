import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ShareButtonsConfig } from 'ngx-sharebuttons';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';

import { ComponentsModule } from 'src/app/components/components.module';
import { NgImageSliderModule } from 'ng-image-slider';
import { PreviewJobEmployerComponent } from './preview-job-employer.component';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { JobPreviewInfoComponent } from './job-preview-info/job-preview-info.component';
import { CompanyPreviewInfoComponent } from './company-preview-info/company-preview-info.component';
import { OtherJobsCardComponent } from './other-jobs-card/other-jobs-card.component';


const customConfig: ShareButtonsConfig = {
  include: ['facebook', 'twitter'],
  theme: 'modern-light',
  // gaTracking: true,
}

@NgModule({
  declarations: [
    PreviewJobEmployerComponent,
    JobPreviewInfoComponent,
    CompanyPreviewInfoComponent,
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
      component: PreviewJobEmployerComponent
    }]),
    FontAwesomeModule
  ]
})

export class PreviewJobEmployerModule { }
