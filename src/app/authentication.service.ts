import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './user';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private userSubject: BehaviorSubject<User | undefined>;
  public user: Observable<User | undefined>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    const userString = localStorage.getItem('user');
    if (userString){
      this.userSubject = new BehaviorSubject<User | undefined>(JSON.parse(userString));
    } else {
      this.userSubject = new BehaviorSubject<User | undefined>(undefined);  
    }
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User | undefined{
    return this.userSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, {username, password})
      .pipe(map(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }))
  }

  logout() {
    //remove user from local storage to log user out
    localStorage.removeItem('user');
    this.userSubject.next(undefined);
    this.router.navigate(['/login'])
  }
}
