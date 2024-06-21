import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardServiceService {
  private apiUrl = 'https://api.tgv.syaznee.com'; // Replace with your backend server URL

  constructor(private http: HttpClient) {}

  getTotalBookedTickets(): Observable<{ totalBookings: number }> {
    return this.http.get<{ totalBookings: number }>('https://api.tgv.syaznee.com/getTotalBookedTickets');
  }

  getUncollectedTickets(): Observable<{ uncollectedTickets: number }> {
    return this.http.get<{ uncollectedTickets: number }>('https://api.tgv.syaznee.com/getUncollectedTickets');
  }

  getActiveMovie(): Observable<{ activeMovie: number }> {
    return this.http.get<{ activeMovie: number }>('https://api.tgv.syaznee.com/getActiveMovie');
  }

  getInactiveMovie(): Observable<{ inactiveMovie: number }> {
    return this.http.get<{ inactiveMovie: number }>('https://api.tgv.syaznee.com/getInactiveMovie');
  }
}
