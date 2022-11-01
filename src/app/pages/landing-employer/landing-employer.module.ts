import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RECAPTCHA_V3_SITE_KEY , RecaptchaV3Module} from 'ng-recaptcha';
import { LandingEmployerComponent } from 'src/app/pages/landing-employer/landing-employer.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { SlidersComponent } from './sliders/sliders.component';
import { environment } from 'src/environments/environment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
@NgModule({
  declarations: [
    LandingEmployerComponent,
    SlidersComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    RecaptchaV3Module,
    FontAwesomeModule,
    RouterModule.forChild([{ 
      path: '', 
      component: LandingEmployerComponent
    }]),
  ],
  providers: [
    {
      provide: RECAPTCHA_V3_SITE_KEY, 
      useValue: environment.reCaptchaV3SiteKey 
    }
  ]
})

export class LandingEmployerModule { }
