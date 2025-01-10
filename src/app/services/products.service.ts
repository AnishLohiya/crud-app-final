import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProduct } from '../interfaces/iproduct';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = "http://localhost:8801/products";

  constructor(private httpClient: HttpClient) { }

  getProducts(): Observable<IProduct[]> {
    return this.httpClient.get<IProduct[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<IProduct> {
    const url = `${this.apiUrl}/${id}`;
    return this.httpClient.get<IProduct>(url);
  }
  
  createProduct(product: IProduct): Observable<IProduct> {
    return this.httpClient.post<IProduct>(this.apiUrl, product);
  }

  updateProduct(id: string, product: IProduct): Observable<IProduct> {
    const url = `${this.apiUrl}/${id}`;
    return this.httpClient.put<IProduct>(url, product);
  }

  deleteProduct(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.httpClient.delete<void>(url);
  }
}
