import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { DirectivesModule } from 'src/app/directives/directives.module';
import { ApplicantsComponent } from 'src/app/pages/employer/applicants/applicants.component';
import { ApplicantItemComponent } from './applicant-item/applicant-item.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [
    ApplicantsComponent,
    ApplicantItemComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule,
    NgMultiSelectDropDownModule.forRoot(),
    RouterModule.forChild([{ 
      path: '', 
      component: ApplicantsComponent
    }]),
    FontAwesomeModule,
    AngularSvgIconModule.forRoot()
  ]
})

export class ApplicantsModule { }
