import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';
import { AssessmentsComponent } from 'src/app/pages/employer/assessments/assessments.component';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { CustomAssessmentsComponent } from './custom-assessments/custom-assessments.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [
    AssessmentsComponent,
    CustomAssessmentsComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    NgbModule,
    FormsModule,
    DirectivesModule,
    RouterModule.forChild([{
      path: '',
      component: AssessmentsComponent
    }]),
    FontAwesomeModule,
    AngularSvgIconModule.forRoot()
  ]
})

export class AssessmentsModule { }
