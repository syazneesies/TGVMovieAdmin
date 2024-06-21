import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';

interface MemberEditprofile {
  name: string;
  email: string;
  role: string;
  phoneNumber: string;
  birthday: string | null;
}

@Component({
  selector: 'app-member-editprofile',
  templateUrl: './member-editprofile.component.html',
  styleUrls: ['./member-editprofile.component.css'],
  providers: [DatePipe]
})
export class MemberEditprofileComponent implements OnInit {
  userId: string;
  name: string;
  phoneNumber: string;
  birthday: Date | null;
  email: string;
  formattedBirthday: string | null;


  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.userId = params['userId'];
      this.getMemberProfile();
    });
  
  }
  private formatDateForInput(date: Date | null): string {
    if (date) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } else {
      return '';
    }
  }

  private formatDateForApi(date: Date | null): string | null {
    return date ? this.datePipe.transform(date, 'yyyy-MM-dd') : null;
  }
  
  
  getFormattedBirthday(): string {
    return this.formatDateForInput(this.birthday);
  }
  

  getMemberProfile() {
    this.http.get<MemberEditprofile>(`https://api.tgv.syaznee.com/profile/${this.userId}`).subscribe(
      (response) => {
        this.name = response.name;
        this.phoneNumber = response.phoneNumber;
        this.email = response.email;
  
        if (response.birthday !== null) {
          // Parse the date string and convert it to a Date object
          this.birthday = new Date(Date.parse(response.birthday));
          this.formattedBirthday = this.formatDateForInput(this.birthday);
        } else {
          this.birthday = null;
          this.formattedBirthday = '';
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
  
  saveProfile() {
    // Parse the formattedBirthday string into a Date object if it's not null
    const parsedBirthday = this.formattedBirthday
      ? new Date(Number(this.formattedBirthday.slice(6, 10)), Number(this.formattedBirthday.slice(3, 5)) - 1, Number(this.formattedBirthday.slice(0, 2)))
      : null;
  
    // Prepare the updated profile data
    const updatedProfile = {
      name: this.name,
      phoneNumber: this.phoneNumber,
      birthday: this.formatDateForApi(parsedBirthday), // Format birthday in "yyyy-MM-dd" format
      email: this.email
    };
  
    // Perform the HTTP request to update the profile on the server
    this.http.put(`https://api.tgv.syaznee.com/memberEditprofile/${this.userId}`, updatedProfile).subscribe(
      () => {
        console.log('Profile updated successfully');
        this.redirectToMemberPage(); // Redirect to the member page after a successful update
      },
      (error) => {
        console.error('Error updating profile:', error);
        // Handle the error and display an appropriate message to the user
        if (error.status === 404) {
          // Profile not found
          alert('Profile not found');
        } else {
          // Other server error
          alert('Failed to update profile. Please try again later.');
        }
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
