import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Orders } from '../api/order';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {

    constructor(private http: HttpClient) { }

    getOrders() {
        return this.http.get(`${environment.api}/orders`)
    }

    getOrdersById(orderId: number) {
        return this.http.get(`${environment.api}/orders/${orderId}`)
    }

    saveOrder(orders: any) {
        console.log(orders)
        return this.http.post(`${environment.api}/orders/create`, orders)
    }
}
