import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()

export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const accessToken = this.authService.getToken();
    if (accessToken && !request.url.includes(environment.converge_host_payment) 
     && !request.url.includes(environment.api_s3)
    ) {
      let headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
      request = request.clone({
        headers
      })
    }

    return next.handle(request);
  }
}