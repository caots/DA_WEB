import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ComponentsModule } from 'src/app/components/components.module';
import { ChangeEmailVerificationComponent } from 'src/app/pages/change-email-verification/change-email-verification.component'

@NgModule({
  declarations: [
    ChangeEmailVerificationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{
      path: '',
      component: ChangeEmailVerificationComponent
    }]),
  ]
})

export class ChangeEmailVerificationModule { }
