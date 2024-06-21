import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { DashboardServiceService } from 'src/app/service/dashboard-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  totalBookings: number;
  uncollectedTickets: number;
  activeMovie: number;
  inactiveMovie: number;

  constructor(private dashboardService: DashboardServiceService) {}


  ngOnInit() {
    this.getDashboardData();
    this.configureSideNavigation();
    this.configureScrollToTop();
  }

  getDashboardData(){
    this.dashboardService.getTotalBookedTickets().subscribe(
      (response) => {
        //console.log(totalBookedTickets);
        this.totalBookings = response.totalBookings;
      },
      (error) => {
        console.error('Error fetching total booked tickets:', error);
      }
    );

    this.dashboardService.getUncollectedTickets().subscribe(
      (response) => {
        this.uncollectedTickets = response.uncollectedTickets;
      },
      (error) => {
        console.error('Error fetching uncollected tickets:', error);
      }
    );

    this.dashboardService.getActiveMovie().subscribe(
      (response) => {
        this.activeMovie = response.activeMovie;
      },
      (error) => {
        console.error('Error fetching uncollected tickets:', error);
      }
    );

    this.dashboardService.getInactiveMovie().subscribe(
      (response) => {
        this.inactiveMovie = response.inactiveMovie;
      },
      (error) => {
        console.error('Error fetching uncollected tickets:', error);
      }
    );

  }

  configureSideNavigation() {
    // Toggle the side navigation
    $("#sidebarToggle, #sidebarToggleTop").on('click', (e) => {
      $("body").toggleClass("sidebar-toggled");
      $(".sidebar").toggleClass("toggled");
      if ($(".sidebar").hasClass("toggled")) {
        $('.sidebar .collapse').removeClass('show');
      }
    });
  }

  configureScrollToTop() {
    // Scroll to top button appear
    $(document).on('scroll', () => {
      const scrollDistance = Number($(document).scrollTop());
      if (!isNaN(scrollDistance) && scrollDistance > 100) {
        $('.scroll-to-top').css('display', 'block');
      } else {
        $('.scroll-to-top').css('display', 'none');
      }
    });


  }
}
