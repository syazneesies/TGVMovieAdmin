import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {

      name: string;
      phoneNumber: string;
      birthday: string;
      email: string;
      password: string;
      confirmPassword: string;

      constructor(private http: HttpClient) {}
    
      onSubmit(): void {
        const registrationData = {
          name: this.name,
          phoneNumber: this.phoneNumber,
          birthday: this.birthday,
          email: this.email,
          password: this.password,
        };

    this.http.post<any>('https://api.tgv.syaznee.com/register', registrationData).subscribe(
      (response) => {
        console.log('Registration successful:', response.message);
        // Handle success, e.g., show a success message or navigate to another page
        window.location.href = response.redirect;
      },
      (error) => {
        console.error('Error:', error.error);
        // Handle error, e.g., display an error message
      }
    );
  }
}
