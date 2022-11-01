import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ComponentsModule } from 'src/app/components/components.module';
import { UserStoryViewComponent } from 'src/app/pages/user-story-view/user-story-view.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    UserStoryViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    RouterModule.forChild([{
      path: '',
      component: UserStoryViewComponent
    }]),
    FontAwesomeModule,
    AngularSvgIconModule.forRoot()
  ]
})

export class UserStoryViewModule { }
