import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { HTTP_METHOD } from 'src/app/constants/config';
import { HelperService } from 'src/app/services/helper.service';

@Injectable()

export class IEInterceptor implements HttpInterceptor {
  constructor(
    private helperService: HelperService,
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Add version to api to ignore cache request on IE
    if (this.helperService.isIEOrEdge() && request.method == HTTP_METHOD.GET) {
      let url = request.url;
      if (url.includes('?')) {
        if (url.includes('version=')) {
          url += `&version_ie=${Date.now()}`;
        } else {
          url += `&version=${Date.now()}`;
        }        
      } else {
        url += `?version=${Date.now()}`;
      }      

      request = request.clone({
        url
      })
    }

    return next.handle(request);
  }
}