import { Component, OnInit } from '@angular/core';
import { BookingService } from 'src/app/service/booking-service.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-manage-bookings',
  templateUrl: './manage-bookings.component.html',
  styleUrls: ['./manage-bookings.component.css']
})
export class ManageBookingsComponent implements OnInit {
  bookings: any[];

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.getBookings();
  }

  getBookings(): void {
    this.bookingService.getAllBookings().subscribe(
      (response) => {
        this.bookings = response.map((booking) => ({
          ...booking,
          status: this.getStatusLabel(booking.status)
        }));
        console.log('Bookings:', this.bookings);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getStatusLabel(status: number): string {
    return status === 0 ? 'Booked' : 'Collected';
  }

  generateReport() {
    // Format booking data for the PDF report
    const data = this.bookings.map((booking) => [
      booking.bookingID,
      booking.movieName,
      booking.release_date,
      booking.seatQuantity,
      booking.user_ID,
      booking.status,
    ]);

    // Set up PDF document
    const doc = new jsPDF.default();
    const tableHeader = ['Booking ID', 'Movie Name', 'Movie Date', 'Seat Quantity', 'User ID', 'Status'];

    // Add title to the report
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('TGV Cinema Bookings Report', 45, 15);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('All Collected & Uncollected Tickets', 45, 20);

    // Add date and time
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const formattedTime = `${date.getHours()}:${date.getMinutes()}`;
    doc.setFontSize(12);
    doc.text(`Date: ${formattedDate}`, 45, 30);
    doc.text(`Time: ${formattedTime}`, 45, 35);

    // Add the company logo to the report
    const logoImage = new Image();
    logoImage.src = 'assets/cinemaIcon2.png'; // Make sure the image path is correct
    doc.addImage(logoImage, 'PNG', 14, 8, 30, 30);

    // Generate table using jspdf-autotable
    (doc as any).autoTable({
      head: [tableHeader],
      body: data,
      startY: 40,
    });

    // Save or print the PDF
    doc.save('booking_report.pdf');
  }

}
