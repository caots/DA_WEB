import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AssessmentsComponent } from 'src/app/pages/job-seeker/assessments/assessments.component';

@NgModule({
  declarations: [
    AssessmentsComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    NgbModule,
    RouterModule.forChild([{
      path: '',
      component: AssessmentsComponent
    }]),
  ]
})

export class AssessmentsModule { }
