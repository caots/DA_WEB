import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { DirectivesModule } from 'src/app/directives/directives.module';

import { MessagesComponent } from 'src/app/pages/job-seeker/messages/messages.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { InfoCardComponent } from './info-card/info-card.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [
    MessagesComponent,
    InfoCardComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule,
    NgMultiSelectDropDownModule.forRoot(),
    RouterModule.forChild([{ 
      path: '', 
      component: MessagesComponent
    }]),
    FontAwesomeModule,
    NgxDocViewerModule,
    InfiniteScrollModule,
    AngularSvgIconModule.forRoot()
  ]
})

export class MessagesModule { }
