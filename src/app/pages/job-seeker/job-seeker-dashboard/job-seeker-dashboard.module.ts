import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { PipesModule } from 'src/app/pipes/pipes.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { JobSeekerDashboardComponent } from './job-seeker-dashboard.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { SearchComponent } from './search/search.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [
    JobSeekerDashboardComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    PipesModule,
    DirectivesModule,
    NgMultiSelectDropDownModule.forRoot(),
    RouterModule.forChild([{
      path: '',
      component: JobSeekerDashboardComponent
    }]),
    FontAwesomeModule,
    AngularSvgIconModule.forRoot()
  ]
})

export class JobSeekerDashboardModule { }
