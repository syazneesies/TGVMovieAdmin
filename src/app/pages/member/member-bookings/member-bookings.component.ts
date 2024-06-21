import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-member-bookings',
  templateUrl: './member-bookings.component.html',
  styleUrls: ['./member-bookings.component.css']
})
export class MemberBookingsComponent implements OnInit {
  userId: string; // To store the user ID passed from the URL
  bookings: any[]; // To store the retrieved bookings

  constructor(
    private http: HttpClient, 
    private route: ActivatedRoute,
    private router: Router,
  ) { } // Inject ActivatedRoute

  ngOnInit() {
    // Get the user ID from the URL parameters
    this.route.queryParams.subscribe((params) => {
      this.userId = params['userId'];
      // Fetch the bookings for the user
      this.getBookings();
    });
  }

  getBookings() {
    this.http.get<any[]>(`https://api.tgv.syaznee.com/memberBookings/${this.userId}`).subscribe(
      (response) => {
        this.bookings = response.map((booking, index) => ({ ...booking, number: index + 1 }));
      },
      (error) => {
        console.error('Error retrieving bookings:', error);
      }
    );
  }

  redirectToMemberPage() {
    this.router.navigate(['/member'], { queryParams: { userId: this.userId } });
  }

  logout(): void {
    // Clear the session storage or remove the token
    sessionStorage.removeItem('token');
    // Redirect to the login page or any other desired page
    this.router.navigate(['/login']);
  }
}
