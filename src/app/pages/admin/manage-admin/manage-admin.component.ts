import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StaffServiceService } from 'src/app/service/staff-service.service';

@Component({
  selector: 'app-manage-admin',
  templateUrl: './manage-admin.component.html',
  styleUrls: ['./manage-admin.component.css']
})
export class ManageAdminComponent implements OnInit {
  constructor(
    private router: Router,
    private staffService: StaffServiceService,
    ) {}

  staff: any[];

  ngOnInit() {
    this.getAllStaff();
  }

  getAllStaff() {
    this.staffService.getStaff().subscribe(
      (response) => {
        this.staff = response; // Assuming the response is an array of staff objects
      },
      (error) => {
        console.error('Error getting staff:', error);
      }
    );
  }

  editStaff(staff: any) {
    this.router.navigate(['/editStaff', staff.user_id], { state: { staffData: staff } });
  }

  deleteStaff(userID: number){
    const confirmation = window.confirm('Are you sure you want to remove this staff?');
    if (confirmation) {
      this.staffService.deleteStaff(userID).subscribe(
        (response) => {
          console.log('User deleted from the database:', response);
          this.getAllStaff();
        },
        (error) => {
          console.error('Error removing staff:', error);
        }
      );
    }
  }

  addStaff() {
    this.router.navigate(['/addStaff']); // Navigate to the AddStaffFormComponent when the button is clicked
  }
}
