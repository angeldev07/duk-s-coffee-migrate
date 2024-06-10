import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Product } from '../api';

@Injectable({
    providedIn: 'root',
})
export class ProductoService {
    constructor(private http: HttpClient) {}

    getProducts() {
      return  this.http.get(`${environment.api}/products`)
    }

    getCategories() {
      return  this.http.get(`${environment.api}/categories`)
    }

    saveProduct(producto: any) {
      return this.http.post(`${environment.api}/products/create`, producto)
    }

    deleteProduct(id: number) {
      return this.http.delete(`${environment.api}/products/delete/${id}`)
    }
    
    updateProduct(producto: Product) {
      return this.http.put(`${environment.api}/products/update`, producto)
    }

    deleteProductsByList(products: number[]){
      return this.http.post(`${environment.api}/products/delete`,  { productsIds: products })
    }

    deactivateByList(products: number[]){
      return this.http.post(`${environment.api}/products/deactivate-batches`, {productsIds: products})
    }

    activateByList(products: number[]){
      return this.http.post(`${environment.api}/products/activate-batches`, {productsIds: products})
    }
}
