import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { ImageCropperModule } from 'ngx-image-cropper';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { NgSelectModule } from '@ng-select/ng-select';

import { ComponentsModule } from 'src/app/components/components.module';
import { EmployerProfileComponent } from 'src/app/pages/employer/employer-profile/employer-profile.component';
import { CompanyInformationComponent } from './company-information/company-information.component';
import { PasswordManagementComponent } from './password-management/password-management.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [
    EmployerProfileComponent,
    CompanyInformationComponent,
    PasswordManagementComponent,
    CompanyProfileComponent,
  ],
  imports: [
    DragDropModule,
    CommonModule,
    ComponentsModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    Ng2TelInputModule,
    ImageCropperModule,
    DirectivesModule,
    NgSelectModule,
    NgMultiSelectDropDownModule,
    RouterModule.forChild([{
      path: '',
      component: EmployerProfileComponent
    }]),
    FontAwesomeModule,
    AngularSvgIconModule.forRoot()
  ]
})

export class EmployerProfileModule { }
