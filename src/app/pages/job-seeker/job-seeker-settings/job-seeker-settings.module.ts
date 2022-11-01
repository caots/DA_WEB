import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { MenuStepComponent } from './menu-step/menu-step.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { CompleteComponent } from './complete/complete.component';
import { AssessmentsComponent } from './assessments/assessments.component';
import { JobSeekerSettingsComponent } from 'src/app/pages/job-seeker/job-seeker-settings/job-seeker-settings.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserFindCandidateProfileComponent } from './user-find-candidate-profile/user-find-candidate-profile.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DemographicSurveyComponent, NgbDateCustomParserFormatter } from './demographic-survey/demographic-survey.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    JobSeekerSettingsComponent,
    MenuStepComponent,
    UserInfoComponent,
    CompleteComponent,
    AssessmentsComponent,
    UserFindCandidateProfileComponent,
    DemographicSurveyComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    NgbModule,
    NgMultiSelectDropDownModule,
    Ng2TelInputModule,
    ImageCropperModule,
    DirectivesModule,
    ReactiveFormsModule,
    NgSelectModule,
    RouterModule.forChild([{
      path: '',
      component: JobSeekerSettingsComponent
    }]),
    FontAwesomeModule,
    AngularSvgIconModule.forRoot()
  ],
  providers: [
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
   ]
})

export class JobSeekerSettingsModule { }
