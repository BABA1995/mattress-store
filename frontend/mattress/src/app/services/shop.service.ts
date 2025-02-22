import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of, throwError, Observable } from 'rxjs';


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
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/owner/${ownerId}`, {headers}).pipe(
      catchError(err => {
        if (err.status === 404) {
          return of(null); // Convert 404 error into a valid observable response
        }
        return throwError(() => err);
      })
    );
  }
}
