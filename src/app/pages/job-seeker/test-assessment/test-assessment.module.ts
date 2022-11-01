import { NgModule } from '@angular/core';
import { BackButtonDisableModule } from 'angular-disable-browser-back-button';

import { ComponentsModule } from 'src/app/components/components.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { TestAssessmentComponent } from 'src/app/pages/job-seeker/test-assessment/test-assessment.component';

@NgModule({
  declarations: [
    TestAssessmentComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    NgbModule,
    BackButtonDisableModule.forRoot({
      preserveScrollPosition: false
    }),
    RouterModule.forChild([{
      path: '',
      component: TestAssessmentComponent
    }]),
  ]
})

export class TestAssessmentModule { }
