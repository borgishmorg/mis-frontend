import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

import { AuthenticationService } from '@services/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.url.endsWith('refresh') || request.url.endsWith('login')) {
      return next.handle(request);
    }

    return next.handle(request).pipe(
      catchError((err) => {
        if ([401, 403].indexOf(err.status) !== -1) {
          return this.authenticationService
            .refresh()
            .pipe(
              catchError((error) => {
                this.authenticationService.logout();
                return throwError(error);
              })
            )
            .pipe(
              mergeMap(() =>
                next.handle(request).pipe(
                  catchError((error) => {
                    this.authenticationService.logout();
                    return throwError(error);
                  })
                )
              )
            );
        } else {
          return throwError(err);
        }
      })
    );
  }
}
