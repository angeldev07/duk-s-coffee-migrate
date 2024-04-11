import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Customers } from '../api/customer';

@Injectable({
    providedIn: 'root'
})
export class ClienteService {

    constructor(private http: HttpClient) { }

    getCustomers() {
        return this.http.get(`${environment.api}/clients`)
    }

    saveCustomer(customer: any) {
        return this.http.post(`${environment.api}/clients/create`, customer)
    }

    deleteCustomer(id: number) {
        return this.http.delete(`${environment.api}/clients/delete/${id}`)
    }

    updateCustomer(customer: Customers) {
        return this.http.put(`${environment.api}/clients/update`, customer)
    }

    customerDetails(id: number) {
        return this.http.get(`${environment.api}/clients/${id}`)
    }

    activeCustomer(id: number, type: boolean) {
        const url = `${environment.api}/clients/${type ? 'off' : 'on'}`
        const params = new HttpParams().set('clientId', id)
        return this.http.put(url, {} ,{params})
      }

}
