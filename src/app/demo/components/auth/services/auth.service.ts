import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoginData } from '../api';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User } from '../api/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router) { }

  get user$(){
    return this.user.asObservable(); 
  }

  public login(data: LoginData){
    this.http.post(`${environment.api}/login`, data).subscribe((response: any) => {
      localStorage.setItem('user', JSON.stringify(response));
      this.user.next(response);
      this.router.navigate(['/backoffice']);
    });
  }

  public isAuthenticated(){
    return !!localStorage.getItem('user');
  }
  
}
