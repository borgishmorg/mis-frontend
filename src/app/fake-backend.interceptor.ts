import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, dematerialize, materialize } from 'rxjs/operators';
import { Role } from './role.enum';

const users = [
  { id: 1, username: 'admin', password: 'admin', firstName: 'Admin', lastName: 'User', role: Role.Admin },
  { id: 2, username: 'user', password: 'user', firstName: 'Normal', lastName: 'User', role: Role.User }
];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const { url, method, headers, body} = request;

    return handleRoute();

    function handleRoute() {
      switch (true) {
          case url.endsWith('/users/authenticate') && method === 'POST':
              return authenticate();
          case url.endsWith('/users') && method === 'GET':
              return getUsers();
          case url.match(/\/users\/\d+$/) && method === 'GET':
              return getUserById();
          default:
              // pass through any requests not handled above
              return next.handle(request);
      }
  }

    function authenticate() {
      const { username, password } = body;
      const user = users.find(x => x.username === username && x.password === password);
      if (!user) return error('Username or password is incorrect');
      return ok({
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          token: `fake-jwt-token.${user.id}`
      });
  }

  function getUsers() {
      if (!isAdmin()) return unauthorized();
      return ok(users);
  }

  function getUserById() {
    if (!isLoggedIn()) return unauthorized();
    const cUser = currentUser();
    if (cUser && !isAdmin() && cUser.id !== idFromUrl()) return unauthorized();
    // only admins can access other user records

    const user = users.find(x => x.id === idFromUrl());
    return ok(user);
  }

  // helper functions

  function ok(body: any) {
      return of(new HttpResponse({ status: 200, body }))
          .pipe(delay(500)); // delay observable to simulate server api call
  }

  function unauthorized() {
      return throwError({ status: 401, error: { message: 'unauthorized' } })
          .pipe(materialize(), delay(500), dematerialize()); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
  }

  function error(message: any) {
      return throwError({ status: 400, error: { message } })
          .pipe(materialize(), delay(500), dematerialize());
  }

  function isLoggedIn() {
      const authHeader = headers.get('Authorization') || '';
      return authHeader.startsWith('Bearer fake-jwt-token');
  }

  function isAdmin() {
    const user = currentUser();
    if (user) {
        return isLoggedIn() && user.role === Role.Admin;
    }
    return false;
  }

  function currentUser() {
    if (!isLoggedIn()) return;
    const authorizationHeader = headers.get('Authorization');
    if (authorizationHeader) {
    const id = parseInt(authorizationHeader.split('.')[1]);
    return users.find(x => x.id === id);
    }
    return undefined
  }

  function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
  }
  }
}
