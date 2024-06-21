import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

interface MemberProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  phoneNumber: string;
  birthday: string | null;
  

}

@Component({
  selector: 'app-member-profile',
  templateUrl: './member-profile.component.html',
  styleUrls: ['./member-profile.component.css'],
})
export class MemberProfileComponent implements OnInit {
  userId: string; // Add userId property
  memberProfile: MemberProfile;
  editMode: boolean = false;
  name: string;
  phoneNumber: string;
  birthday: Date | null;
  email: string;
  minDate: string;
  formattedBirthday: string | null;

  @ViewChild('editButton') editButtonRef!: ElementRef;

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
    this.birthday = null;
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
    if (date === null) {
      return null;
    } else {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }

  getFormattedBirthday(): string {
    return this.formatDateForInput(this.birthday);
  }
  
  
  getMemberProfile() {
    this.http.get<MemberProfile>(`https://api.tgv.syaznee.com/profile/${this.userId}`).subscribe(
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
  
  redirectToMemberPage() {
    this.router.navigate(['/member'], { queryParams: { userId: this.userId } });
  }

  redirectToEditProfilePage() {
    this.router.navigate(['/member-editprofile'],{ queryParams: { userId: this.userId } });
  }

  
  logout(): void {
    // Clear the session storage or remove the token
    sessionStorage.removeItem('token');
    // Redirect to the login page or any other desired page
    this.router.navigate(['/login']);
  }
}
