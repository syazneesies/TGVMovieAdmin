import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { StaffServiceService } from 'src/app/service/staff-service.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-manage-profile',
  templateUrl: './manage-profile.component.html',
  styleUrls: ['./manage-profile.component.css']
})
export class ManageProfileComponent {

  userId: string; // The ID of the user retrieved from the URL
  user: any = {
    isPasswordChanged: false
  };

  onPasswordChange() {
    this.user.isPasswordChanged = true;
  }

  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient,
    private router: Router,
    private datePipe: DatePipe,
    private staffService: StaffServiceService
  ) {}

  ngOnInit() {
    // Retrieve userId from the stored token in sessionStorage
    const userId = this.getUserIdFromToken();

    if (userId) {
      this.getUserProfile(userId);
    } else {
      console.error('User ID not found in token.');
      // Handle the case when userId is not available or show an error message
    }
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  getUserIdFromToken(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwt_decode(token);
        const userId = decodedToken.userId;
        return userId;
      } catch (error: any) {
        console.error('Error decoding token:', error.message);
      }
    }
    return null;
  }

  getUserProfile(userId: string) {
    this.staffService.getUserById(userId).subscribe(
      (userProfile) => {
        this.user = userProfile; // Assign the returned user data to the 'user' object
        if (this.user.birthday) {
          this.user.birthday = this.formatDate(this.user.birthday);
        }
      },
      (error) => {
        console.error('Error getting user profile:', error);
        // Handle error or show error message
      }
    );
  }

  formatDate(dateString: string): string {
    // Convert the date string to a Date object
    const date = new Date(dateString);

    // Get the individual parts of the date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    // Format the date as "yyyy-MM-dd"
    return `${year}-${month}-${day}`;
  }

  onSubmit() {
    this.staffService.updateStaff(this.user).subscribe(
      (response) => {
        console.log('Staff updated successfully:', response);
        window.location.href = `/manageProfile?userId=${this.userId}`;
      },
      (error) => {
        console.error('Error updating staff:', error);
        // Handle error or show error message
      }
    );
  }
}
