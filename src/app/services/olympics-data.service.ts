import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOlympicData } from '../interfaces/iolympic-data';

@Injectable({
  providedIn: 'root'
})
export class OlympicsDataService {
   private apiUrl = "http://localhost:8801/data";

  constructor(private httpClient: HttpClient) { }

  getOlympicsData(): Observable<IOlympicData[]> {
    return this.httpClient.get<IOlympicData[]>(this.apiUrl);
  }

  getOlympicDataById(id: string): Observable<IOlympicData> {
    return this.httpClient.get<IOlympicData>(`${this.apiUrl}/${id}`);
  }

  createOlympicData(data: IOlympicData): Observable<IOlympicData> {
    return this.httpClient.post<IOlympicData>(this.apiUrl, data);
  }

  updateOlympicData(id: string, data: IOlympicData): Observable<IOlympicData> {
    return this.httpClient.put<IOlympicData>(`${this.apiUrl}/${id}`, data);
  }

  deleteOlympicData(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
