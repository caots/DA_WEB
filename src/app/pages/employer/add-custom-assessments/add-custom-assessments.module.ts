import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { AddCustomAssessmentsComponent } from './add-custom-assessments.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AddCustomAssessmentsComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule,
    RouterModule.forChild([{
      path: '',
      component: AddCustomAssessmentsComponent
    }]),
    FontAwesomeModule
  ]
})

export class AddCustomAssessmentsModule { }
