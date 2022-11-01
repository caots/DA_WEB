import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ComponentsModule } from 'src/app/components/components.module';
import { EmailVerificationComponent } from 'src/app/pages/email-verification/email-verification.component';

@NgModule({
  declarations: [
    EmailVerificationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{
      path: '',
      component: EmailVerificationComponent
    }]),
  ]
})

export class EmailVerificationModule { }
