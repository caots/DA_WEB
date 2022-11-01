import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RECAPTCHA_V3_SITE_KEY , RecaptchaV3Module} from 'ng-recaptcha';

import { HomeComponent } from 'src/app/pages/home/home.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { SlidersComponent } from './sliders/sliders.component';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    HomeComponent,
    SlidersComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    RecaptchaV3Module,
    FontAwesomeModule,
    RouterModule.forChild([{ 
      path: '', 
      component: HomeComponent
    }]),
  ],
  providers: [
    { 
      provide: RECAPTCHA_V3_SITE_KEY, 
      useValue: environment.reCaptchaV3SiteKey 
    }
  ]
})

export class HomeModule { }
