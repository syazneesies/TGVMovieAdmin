import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './pages/member/registration/registration.component';
import { FooterComponent } from './pages/admin/footer/footer.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { AdminForgotPassComponent } from './pages/admin/admin-forgot-pass/admin-forgot-pass.component';
import { AddMovieComponent } from './pages/admin/add-movie/add-movie.component';
import { CollectedTicketComponent } from './pages/admin/collected-ticket/collected-ticket.component';
import { ManageBookingsComponent } from './pages/admin/manage-bookings/manage-bookings.component';
import { ManageMovieComponent } from './pages/admin/manage-movie/manage-movie.component';
import { ManageProfileComponent } from './pages/admin/manage-profile/manage-profile.component';
import { TopbarComponent } from './pages/admin/topbar/topbar.component';
import { UncollectedTicketComponent } from './pages/admin/uncollected-ticket/uncollected-ticket.component';
import { AdminLoginComponent } from './pages/admin/admin-login/admin-login.component';
import { LoginComponent } from './pages/member/login/login.component';
import { HomeComponent } from './pages/member/home/home.component';
import { MemberComponent } from './pages/member/member/member.component';
import { MemberProfileComponent } from './pages/member/member-profile/member-profile.component';
import { MemberBookingsComponent } from './pages/member/member-bookings/member-bookings.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { EditMovieComponent } from './pages/admin/edit-movie/edit-movie.component';
import { SidebarComponent } from './pages/admin/sidebar/sidebar.component';
import { MemberEditprofileComponent } from './pages/member/member-editprofile/member-editprofile.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { ManageAdminComponent } from './pages/admin/manage-admin/manage-admin.component';
import { AddStaffComponent } from './pages/admin/add-staff/add-staff.component';
import { EditStaffComponent } from './pages/admin/edit-staff/edit-staff.component';


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    DashboardComponent,
    AdminLoginComponent,
    AdminForgotPassComponent,
    AddMovieComponent,
    ManageMovieComponent,
    EditMovieComponent,
    TopbarComponent,
    ManageProfileComponent,
    RegistrationComponent,
    ManageBookingsComponent,
    CollectedTicketComponent,
    UncollectedTicketComponent,
    LoginComponent,
    MemberProfileComponent,
    HomeComponent,
    MemberComponent,
    MemberBookingsComponent,
    EditMovieComponent,
    SidebarComponent,
    MemberEditprofileComponent,
    ManageAdminComponent,
    AddStaffComponent,
    EditStaffComponent,
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    CommonModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule

  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
