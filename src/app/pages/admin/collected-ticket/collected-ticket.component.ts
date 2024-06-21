import { Component, OnInit} from '@angular/core';
import { BookingService } from 'src/app/service/booking-service.service';

@Component({
  selector: 'app-collected-ticket',
  templateUrl: './collected-ticket.component.html',
  styleUrls: ['./collected-ticket.component.css']
})
export class CollectedTicketComponent {

  bookings: any[];

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.getCollectedTickets();
  }

  getCollectedTickets(): void {
    this.bookingService.getCollectedTickets().subscribe(
      (response) => {
        this.bookings = response;
        console.log('Bookings:', this.bookings);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  rejectTicket(id:number){
    if (confirm('Are you sure you want to reject from taking this ticket?')) {
      this.bookingService.updateTicketStatus(id, 1).subscribe(
        () => {
          //console.log('ticket updated successfully');
          this.getCollectedTickets(); // Refresh the table with updated data
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    }
  }

 

}
