import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoginData } from '../api';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User } from '../api/user';
import { er } from '@fullcalendar/core/internal-common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    const user = localStorage.getItem('user');
    if(user){
      this.user.next(JSON.parse(user).user);
    }
  }

  get user$(){
    return this.user.asObservable();
  }
  get userValue (){
    return this.user.getValue();
  }

  public localUser(response: any){
    localStorage.setItem('user', JSON.stringify(response));
    this.user.next(response);
    this.router.navigate(['/backoffice/inventario/'], {replaceUrl: true});
  }

  public login(data: LoginData){
    return this.http.post(`${environment.api}/login`, data)
  }

  public logout(){
    localStorage.clear();
    this.user.next(null);
    this.router.navigate(['/login'], {replaceUrl: true});
  }

  public isAuthenticated(){
    return !!localStorage.getItem('user');
  }

}
