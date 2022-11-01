import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from 'src/app/components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ResetPasswordComponent } from 'src/app/pages/reset-password/reset-password.component';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  declarations: [
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    NgbModule,
    FormsModule,
    DirectivesModule,
    ReactiveFormsModule,
    RouterModule.forChild([{
      path: '',
      component: ResetPasswordComponent
    }]),
  ]
})

export class ResetPasswordModule { }
