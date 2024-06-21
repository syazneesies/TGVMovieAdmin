import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemberBookingsComponent } from './pages/member/member-bookings/member-bookings.component';
import { AddMovieComponent } from './pages/admin/add-movie/add-movie.component';
import { AdminForgotPassComponent } from './pages/admin/admin-forgot-pass/admin-forgot-pass.component';
import { AdminLoginComponent } from './pages/admin/admin-login/admin-login.component';
import { CollectedTicketComponent } from './pages/admin/collected-ticket/collected-ticket.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { ManageBookingsComponent } from './pages/admin/manage-bookings/manage-bookings.component';
import { ManageMovieComponent } from './pages/admin/manage-movie/manage-movie.component';
import { EditMovieComponent } from './pages/admin/edit-movie/edit-movie.component';
import { ManageProfileComponent } from './pages/admin/manage-profile/manage-profile.component';
import { UncollectedTicketComponent } from './pages/admin/uncollected-ticket/uncollected-ticket.component';
import { HomeComponent } from './pages/member/home/home.component';
import { LoginComponent } from './pages/member/login/login.component';
import { MemberProfileComponent } from './pages/member/member-profile/member-profile.component';
import { MemberComponent } from './pages/member/member/member.component';
import { RegistrationComponent } from './pages/member/registration/registration.component';
import { MemberEditprofileComponent } from './pages/member/member-editprofile/member-editprofile.component';
import { ManageAdminComponent } from './pages/admin/manage-admin/manage-admin.component';
import { AddStaffComponent } from './pages/admin/add-staff/add-staff.component';
import { EditStaffComponent } from './pages/admin/edit-staff/edit-staff.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'adminLogin', component: AdminLoginComponent },
  { path: 'adminForgotPassword', component: AdminForgotPassComponent, },
  { path: 'dashboard', component: DashboardComponent, },
  { path: 'manageProfile', component: ManageProfileComponent },
  { path: 'addMovie', component: AddMovieComponent, },
  { path: 'manageMovie', component: ManageMovieComponent, },
  { path: 'register', component: RegistrationComponent },
  { path: 'manageBookings', component: ManageBookingsComponent, },
  { path: 'collectedTicket', component: CollectedTicketComponent, },
  { path: 'uncollectedTicket', component: UncollectedTicketComponent, },
  { path: 'login', component: LoginComponent },
  { path: 'memberProfile', component: MemberProfileComponent},
  { path: 'home', component:HomeComponent},
  { path: 'member', component:MemberComponent},
  { path: 'memberBookings', component:MemberBookingsComponent},
  { path: 'editMovie/:id', component: EditMovieComponent },
  { path: 'member-editprofile', component: MemberEditprofileComponent },
  { path: 'manageAdmin', component: ManageAdminComponent, },
  { path: 'addStaff', component: AddStaffComponent, },
  { path: 'editStaff/:id', component: EditStaffComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
