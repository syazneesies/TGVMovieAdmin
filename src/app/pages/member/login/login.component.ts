import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const userId = params['userId'];
      if (userId) {
        // Store the userId in session storage
        sessionStorage.setItem('userId', userId);
      }
    });
  }

  login(): void {
    this.http.post<any>('https://api.tgv.syaznee.com/login', { email: this.email, password: this.password }).subscribe(
      (response) => {
        if (response.redirect) {
          // Redirect to the specified URL with userId
          console.log(response.userId);
          sessionStorage.setItem('token', response.token);
          window.location.href = `/member?userId=${response.userId}`;
        } else {
          console.log(response.message);
          // Store the token in session storage
          sessionStorage.setItem('token', response.token);
          // Make an API call with the captured token
          this.getData();
        }
      },
      (error) => {
        console.error('Error:', error.error);
      }
    );
  }

  getData(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.get<any>('https://api.tgv.syaznee.com/member/api/home', { headers }).subscribe(
        (response) => {
          // Handle successful API call
          console.log(response);
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    } else {
      console.error('Token not found in session storage');
    }
  }
}
