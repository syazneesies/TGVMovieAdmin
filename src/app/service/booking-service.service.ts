import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private baseUrl = 'https://api.tgv.syaznee.com'; // Replace with the correct API URL

  constructor(private http: HttpClient) { }

  getAllBookings() {
    return this.http.get<any[]>(this.baseUrl + '/bookings/admin');
  }

  getUncollectedTickets(){
    return this.http.get<any[]>(this.baseUrl +'/bookedTickets');
  }

  getCollectedTickets(){
    return this.http.get<any[]>(this.baseUrl + '/collectedTickets')
  }

  updateTicketStatus(id:number, status:number){    
    var newStatus = 0;

    if(status == 0){
      newStatus = 1;
    }
    else{
      newStatus = 0;
    }

    //const body = 

    return this.http.put(`${this.baseUrl}/booking/status/${id}`, {newStatus}); 

    
  }
}
