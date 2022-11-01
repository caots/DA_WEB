import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule , NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgSelectModule } from '@ng-select/ng-select';

import { DirectivesModule } from 'src/app/directives/directives.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { DashboardComponent } from 'src/app/pages/employer/dashboard/dashboard.component';
import { SearchComponent, NgbDateCustomParserFormatter } from './search/search.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [
    DashboardComponent,
    SearchComponent,
  ],
  imports: [
    ComponentsModule,
    CommonModule,
    NgbModule,
    FormsModule,
    DirectivesModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgMultiSelectDropDownModule.forRoot(),
    RouterModule.forChild([{ 
      path: '', 
      component: DashboardComponent
    }]),
    FontAwesomeModule,
    AngularSvgIconModule.forRoot()
  ],
  providers: [
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
   ]
})

export class DashboardModule { }
