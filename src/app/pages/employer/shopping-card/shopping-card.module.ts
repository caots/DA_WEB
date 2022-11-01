import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { ImageCropperModule } from 'ngx-image-cropper';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { NgbModule , NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

import { ComponentsModule } from 'src/app/components/components.module';
import { ShoppingCardComponent, NgbDateCustomParserFormatter } from 'src/app/pages/employer/shopping-card/shopping-card.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularSvgIconModule } from 'angular-svg-icon';


@NgModule({
  declarations: [
    ShoppingCardComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    Ng2TelInputModule,
    ImageCropperModule,
    DirectivesModule,
    AngularSvgIconModule.forRoot(),
    RouterModule.forChild([{
      path: '',
      component: ShoppingCardComponent
    }]),
    FontAwesomeModule
  ],
  providers: [
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
   ]

})

export class ShoppingCardModule { }
