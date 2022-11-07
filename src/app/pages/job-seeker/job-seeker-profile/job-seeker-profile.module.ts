import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { ComponentsModule } from 'src/app/components/components.module';
import { JobSeekerProfileComponent } from 'src/app/pages/job-seeker/job-seeker-profile/job-seeker-profile.component';
import { UserInformationsComponent } from './user-informations/user-informations.component';
import { PasswordManagementComponent } from './password-management/password-management.component';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PfDemographicSurveyComponent, NgbDateCustomParserFormatter } from './pf-demographic-survey/pf-demographic-survey.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [
    JobSeekerProfileComponent,
    UserInformationsComponent,
    PasswordManagementComponent,
    PfDemographicSurveyComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    NgbModule,
    DirectivesModule,
    Ng2TelInputModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    NgMultiSelectDropDownModule,
    NgSelectModule,
    RouterModule.forChild([{
      path: '',
      component: JobSeekerProfileComponent
    }]),
    FontAwesomeModule,
    AngularSvgIconModule.forRoot()
  ],
  providers: [
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
   ]
})

export class JobSeekerProfileModule { }
