import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RevisionService {

  constructor(private http: HttpClient) { }

  getStats() {
    return this.http.get(`${environment.api}/products/stats`)
  }

}
