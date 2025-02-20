import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private apiUrl = 'http://localhost:5000/api/shops';

  constructor(private http: HttpClient) {}

  createShop(shopData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, shopData);
  }

  getShopByOwner(ownerId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/owner/${ownerId}`);
  }
}
