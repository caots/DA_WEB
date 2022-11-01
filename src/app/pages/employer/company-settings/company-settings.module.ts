import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { ImageCropperModule } from 'ngx-image-cropper';

import { PipesModule } from 'src/app/pipes/pipes.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { CompanySettingsComponent } from 'src/app/pages/employer/company-settings/conpany-settings.component';
import { JobPostingsComponent } from './job-postings/job-postings.component';
import { CompanyInfoComponent } from './company-info/company-info.component';
import { MenuStepComponent } from './menu-step/menu-step.component';
import { CompleteComponent } from './complete/complete.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CompnayProfileDetailsComponent } from './compnay-profile-details/compnay-profile-details.component';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [
    CompanySettingsComponent,
    JobPostingsComponent,
    CompanyInfoComponent,
    MenuStepComponent,
    CompleteComponent,
    CompnayProfileDetailsComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    PipesModule,
    FormsModule,
    NgbModule,
    ImageCropperModule,
    ReactiveFormsModule,
    DirectivesModule,
    Ng2TelInputModule,
    NgxSkeletonLoaderModule,
    RouterModule.forChild([{
      path: '',
      component: CompanySettingsComponent
    }]),
    FontAwesomeModule,
    AngularSvgIconModule.forRoot()
  ]
})

export class CompanySettingsModule { }
