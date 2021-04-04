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
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    const userString = localStorage.getItem('user');
    if (userString !== null){
      this.userSubject = new BehaviorSubject<User>(JSON.parse(userString));
    } else {
      this.userSubject = new BehaviorSubject<User>(new User());  
    }
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User{
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
    this.userSubject.next(new User());
    this.router.navigate(['/login'])
  }
}
