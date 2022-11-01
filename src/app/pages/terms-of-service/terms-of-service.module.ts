import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsOfServiceComponent } from './terms-of-service.component';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';


@NgModule({
  declarations: [TermsOfServiceComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    RouterModule.forChild([{
      path: '',
      component: TermsOfServiceComponent
    }]),
  ]
})
export class TermsOfServiceModule { }
