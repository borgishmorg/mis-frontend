import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const access_token = this.authenticationService.access_token;

    if (access_token) {
      const isApiUrl = request.url.startsWith(environment.apiUrl);
      if (access_token && isApiUrl) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${access_token}`
          }
        });
      }
    }    
    return next.handle(request);
  }
}
