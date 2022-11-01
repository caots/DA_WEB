import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RECAPTCHA_V3_SITE_KEY , RecaptchaV3Module} from 'ng-recaptcha';

import { environment } from 'src/environments/environment';
import { LoginComponent } from 'src/app/pages/login/login.component';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    DirectivesModule,
    ReactiveFormsModule,
    RecaptchaV3Module,    
    RouterModule.forChild([{
      path: '',
      component: LoginComponent
    }]),
    FontAwesomeModule,
    AngularSvgIconModule.forRoot()
  ],
  providers: [
    { 
      provide: RECAPTCHA_V3_SITE_KEY, 
      useValue: environment.reCaptchaV3SiteKey 
    }
  ],
})

export class LoginModule { }
