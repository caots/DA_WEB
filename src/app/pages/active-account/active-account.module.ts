import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ComponentsModule } from 'src/app/components/components.module';
import { ActiveAccountComponent } from 'src/app/pages/active-account/active-account.component';

@NgModule({
  declarations: [
    ActiveAccountComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    ReactiveFormsModule,
    ComponentsModule,
    RouterModule.forChild([{
      path: '',
      component: ActiveAccountComponent
    }]),
  ]
})

export class ActiveAccountModule { }
