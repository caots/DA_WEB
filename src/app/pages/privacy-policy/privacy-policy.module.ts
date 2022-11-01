import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyPolicyComponent } from './privacy-policy.component';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  declarations: [PrivacyPolicyComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    RouterModule.forChild([{
      path: '',
      component: PrivacyPolicyComponent
    }]),
  ]
})
export class PrivacyPolicyModule { }
