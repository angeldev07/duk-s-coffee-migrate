import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Category } from '../api';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategories() {
    return  this.http.get(`${environment.api}/categories`)
  }

  deleteCategory(id: number) {
    return this.http.delete(`${environment.api}/categories/delete/${id}`)
  }

  activeCategory(id: number, type: boolean) {
    const url = `${environment.api}/categories/${type ? 'on' : 'off'}`
    const params = new HttpParams().set('categoryId', id)
    return this.http.put(url, {} ,{params})
  }

  saveCategory(category: Category) {
    return this.http.post(`${environment.api}/categories/create`, category)
  }

  updateCategory(category: Category) {
    return this.http.put(`${environment.api}/categories/update/${category.id}`, category)
  }

  activeDeactivateByList(categories: number[], option: string){
    return this.http.post(`${environment.api}/categories/on-batches?option=${option}`, {productsIds: categories})
  }

  deleteCategoriesByList(categories: number[]){
    return this.http.post(`${environment.api}/categories/delete`,  { productsIds: categories })
  }

}
