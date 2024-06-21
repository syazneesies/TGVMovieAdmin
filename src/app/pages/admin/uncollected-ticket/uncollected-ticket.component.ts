import { Component, OnInit} from '@angular/core';
import { BookingService } from 'src/app/service/booking-service.service';

@Component({
  selector: 'app-uncollected-ticket',
  templateUrl: './uncollected-ticket.component.html',
  styleUrls: ['./uncollected-ticket.component.css']
})
export class UncollectedTicketComponent {
  bookings: any[];

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.getUncollectedTickets();
  }

  getUncollectedTickets(): void {
    this.bookingService.getUncollectedTickets().subscribe(
      (response) => {
        this.bookings = response;
        console.log('Bookings:', this.bookings);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  collectTicket(id:number){
    if (confirm('Are you sure you want to collect this ticket?')) {
      this.bookingService.updateTicketStatus(id, 0).subscribe(
        () => {
          //console.log('ticket updated successfully');
          this.getUncollectedTickets(); // Refresh the table with updated data
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    }
  }

 

}
