import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ComponentsModule } from 'src/app/components/components.module';
import { UnsubscribePageComponent } from 'src/app/pages/unsubscribe-page/unsubscribe-page.component';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [
    UnsubscribePageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    ReactiveFormsModule,
    ComponentsModule,
    RouterModule.forChild([{
      path: '',
      component: UnsubscribePageComponent
    }]),
    AngularSvgIconModule.forRoot(),
  ]
})

export class UnSubscribePageModule { }
