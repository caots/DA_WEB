import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CompanyInfoComponent } from './company-info.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
@NgModule({
  declarations: [
    CompanyInfoComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    ComponentsModule,
    RouterModule.forChild([{
      path: '',
      component: CompanyInfoComponent
    }]),
    FontAwesomeModule
  ]
})

export class CompanyInfoModule { }
