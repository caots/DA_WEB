import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FindCandidatesComponent } from 'src/app/pages/employer/find-candidates/find-candidates.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { RouterModule } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';


@NgModule({
  declarations: [FindCandidatesComponent],
  imports: [
    ComponentsModule,
    CommonModule,
    NgbModule,
    FormsModule,
    DirectivesModule,
    ReactiveFormsModule,
    AngularSvgIconModule.forRoot(),
    RouterModule.forChild([{ 
      path: '', 
      component: FindCandidatesComponent
    }]),
    FontAwesomeModule
  ]
})
export class FindCandidatesModule { }
