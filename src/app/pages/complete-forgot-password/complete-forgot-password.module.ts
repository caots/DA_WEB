import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ComponentsModule } from 'src/app/components/components.module';
import { CompleteForgotPasswordComponent } from 'src/app/pages/complete-forgot-password/complete-forgot-password.component';

@NgModule({
  declarations: [
    CompleteForgotPasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    ReactiveFormsModule,
    ComponentsModule,
    RouterModule.forChild([{
      path: '',
      component: CompleteForgotPasswordComponent
    }]),
  ]
})

export class CompleteForgotPasswordModule { }
