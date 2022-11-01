import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from 'src/app/components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ForgotPasswordComponent } from 'src/app/pages/forgot-password/forgot-password.component';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [
    ForgotPasswordComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    NgbModule,
    DirectivesModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    RouterModule.forChild([{
      path: '',
      component: ForgotPasswordComponent
    }]),
    AngularSvgIconModule.forRoot(),
  ]
})

export class ForgotPasswordModule { }
