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

  async createShop(shopData: any): Promise<Observable<any>> {
    const token = localStorage.getItem('authToken'); // Fetch token
    if (!token) {
      console.error('No token found!');
      return throwError(() => new Error('Authentication required'));
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Include token in headers
      'Content-Type': 'application/json',
    });
  
    return this.http.post(`${this.apiUrl}/create`, shopData, { headers });
  }

    /**
   * Get address from latitude and longitude using OpenStreetMap
   * @param lat - Latitude
   * @param lng - Longitude
   * @returns Observable with address response
   */
    getAddressFromCoords(lat: number, lng: number): Observable<any> {
      const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
      return this.http.get<any>(geocodeUrl);
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
