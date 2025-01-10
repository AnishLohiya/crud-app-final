import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEquity } from '../../interfaces/iequity';

@Injectable({
  providedIn: 'root'
})
export class EquityService {
  private apiUrl = "http://localhost:3000/data";

  constructor(private httpClient: HttpClient) { }

  getEquities(): Observable<IEquity[]> {
    return this.httpClient.get<IEquity[]>(this.apiUrl);
  }

  getEquityById(id: string): Observable<IEquity> {
    return this.httpClient.get<IEquity>(`${this.apiUrl}/${id}`);
  }

  createEquity(equityData: IEquity): Observable<IEquity> {
    return this.httpClient.post<IEquity>(this.apiUrl, equityData);
  }

  updateEquity(id: string, data: IEquity): Observable<IEquity> {
    return this.httpClient.put<IEquity>(`${this.apiUrl}/${id}`, data);
  }

  deleteEquity(id: string) : Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
