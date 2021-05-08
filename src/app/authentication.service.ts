import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from './user.service';
import { User, Tokens } from './models';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private userSubject: BehaviorSubject<User | undefined>;
  public user: Observable<User | undefined>;
  public access_token?: string;
  public refresh_token?: string;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject<User | undefined>(undefined);  
    this.user = this.userSubject.asObservable();
    const tokensString = localStorage.getItem('tokens');
    if (tokensString) {
      const tokens: Tokens = JSON.parse(tokensString);
      this.access_token = tokens.access_token;
      this.refresh_token = tokens.refresh_token;
      this.userSubject.next(tokens.user);
    }
  }

  public get userValue(): User | undefined{
    return this.userSubject.value;
  }

  login(
    username: string, 
    password: string
  ) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded'
      })
    };

    const params = new HttpParams({
      fromObject: {
        username: username,
        password: password,
        grant_type: 'password',
      }
    });

    return this.http.post<Tokens>(
      `${environment.apiUrl}/auth/login`, 
      params,
      httpOptions
    ).pipe(map(
      tokens => {
        localStorage.setItem('tokens', JSON.stringify(tokens));
        this.access_token = tokens.access_token;
        this.refresh_token = tokens.refresh_token;
        this.userSubject.next(tokens.user);
        return tokens;
      }
    ));
  }

  logout() {
    localStorage.removeItem('tokens');
    this.userSubject.next(undefined);
    this.router.navigate(['/login'])
  }
}
