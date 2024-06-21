import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent{

  userName: string;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit() {
    // Retrieve userId from the stored token in sessionStorage
    const name = this.getUserNameFromToken();
    this.userName = name!;

  }


  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  getUserNameFromToken(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwt_decode(token);
        const name = decodedToken.name;
        return name;
      } catch (error: any) {
        console.error('Error decoding token:', error.message);
      }
    }
    return null;
  }
}
