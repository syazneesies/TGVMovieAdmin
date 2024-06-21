import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StaffServiceService } from 'src/app/service/staff-service.service';

@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.css']
})
export class AddStaffComponent {

      name: string;
      phone: string;
      birthday: string;
      email: string;
      password: string;
      confirmPassword: string;
      positions: string;

  constructor(
    private staffService: StaffServiceService,
    private router: Router
  ) {}

  

  goBack(){
   this.router.navigate(['/manageAdmin']);
  }

  onSubmit(){
    const staffData = {
      name: this.name,
      phoneNumber: this.phone,
      birthday: this.birthday,
      email: this.email,
      password: this.password,
      positions: this.positions
  };
    //console.log(staffData);

    this.staffService.addStaff(staffData).subscribe(
    (response) => {
      console.log('staff added succesfully:' + response);
      window.location.href = response.redirect;
    },
    (error) => {
      //handle errors if needed
      console.error('error adding staff', error);
    }
    )
  }
}
