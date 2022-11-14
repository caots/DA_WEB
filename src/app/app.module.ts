import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import {SwiperModule, SwiperConfigInterface, SWIPER_CONFIG} from 'ngx-swiper-wrapper';

import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppComponent } from 'src/app/app.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { JwtInterceptor } from 'src/app/jwt.interceptor';
import { ErrorInterceptor } from 'src/app/error.interceptor';
import { IEInterceptor } from 'src/app/ie.interceptor';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { MessageService } from './services/message.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChartsModule } from 'ng2-charts';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const config: SocketIoConfig = { url: `${environment.host}`, options: {
  autoConnect: false,
  withCredentials: true,
  // transports: ['websocket']
} };
const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    DragDropModule,
    SocketIoModule.forRoot(config),
    AppRoutingModule,
    HttpClientModule,
    ComponentsModule,
    FontAwesomeModule,
    NgbModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      maxOpened: 1,
      preventDuplicates: true,
      resetTimeoutOnDuplicate: true,
      countDuplicates: true
    }),
    ImageCropperModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgSelectModule, 
    FormsModule,
    SwiperModule,
    ChartsModule,
    NgxDocViewerModule,
    InfiniteScrollModule,
  ],
  providers: [
    NgbActiveModal,
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: JwtInterceptor
    },
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: ErrorInterceptor
    },
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: IEInterceptor
    },
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
