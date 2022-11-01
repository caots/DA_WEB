import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RECAPTCHA_V3_SITE_KEY , RecaptchaV3Module} from 'ng-recaptcha';

import { environment } from 'src/environments/environment';
import { RegisterComponent } from 'src/app/pages/register/register.component';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    Ng2TelInputModule,
    FontAwesomeModule,
    DirectivesModule,
    ReactiveFormsModule,
    RecaptchaV3Module,
    NgbModule,
    AngularSvgIconModule.forRoot(),
    RouterModule.forChild([{
      path: '',
      component: RegisterComponent
    }]),
  ],
  providers: [
    { 
      provide: RECAPTCHA_V3_SITE_KEY, 
      useValue: environment.reCaptchaV3SiteKey 
    }
  ],
})

export class RegisterModule { }
