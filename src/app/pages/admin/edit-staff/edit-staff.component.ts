import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { StaffServiceService } from 'src/app/service/staff-service.service';
//import * as bcrypt from 'bcrypt';

@Component({
  selector: 'app-edit-staff',
  templateUrl: './edit-staff.component.html',
  styleUrls: ['./edit-staff.component.css']
})

export class EditStaffComponent implements OnInit{
  staff: any = {
    isPasswordChanged: false
  };
  

  onPasswordChange() {
    this.staff.isPasswordChanged = true;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private staffService: StaffServiceService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const staffId = params.get('id');
      if (staffId) {
        this.staff = history.state.staffData;
        console.log(this.staff);
        // Parse the string date to Date object
        if (this.staff.birthday) {
          this.staff.birthday = this.formatDate(this.staff.birthday);
        }
      } else {
        console.log("Invalid user ID");
      }
    });
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
    //console.log(this.staff)
    this.staffService.updateStaff(this.staff).subscribe(
      (response) => {
        console.log('Staff updated successfully:', response);
        window.location.href = response.redirect;
      },
      (error) => {
        console.error('Error updating staff:', error);
        // Handle error or show error message
      }
    );
  }

  goBack(){
    this.router.navigate(['/manageAdmin']);
   }
}
