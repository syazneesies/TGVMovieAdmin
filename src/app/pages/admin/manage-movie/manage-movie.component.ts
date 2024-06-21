import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-movie',
  templateUrl: './manage-movie.component.html',
  styleUrls: ['./manage-movie.component.css']
})
export class ManageMovieComponent implements OnInit, OnDestroy {
  movies: any[] = [];
  editForm: FormGroup;
  modalRef: NgbModalRef;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      genre: ['', Validators.required],
      duration: ['', Validators.required],
      release_date: ['', Validators.required],
      director: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadMovies();
  }

  ngOnDestroy() {
    // Clean up the modal when the component is destroyed
    if (this.modalRef) {
      this.modalRef.dismiss();
    }
  }
  addMovie() {
    this.router.navigate(['/addMovie']);
  }
  loadMovies() {
    // Call the API or any other logic to load movies
    this.http.get<any[]>('https://api.tgv.syaznee.com/movies').subscribe(
      (data) => {
        console.log('API Response:', data); // Log the API response to verify the data structure
        this.movies = data;
      },
      (error) => {
        console.error('Error loading movies:', error);
      }
    );
  }

  getStatusLabel(status: number): string {
    return status === 0 ? 'Inactive' : 'Active';
  }

  toggleStatus(movie: any) {
    // Toggle the status value between 0 and 1
    movie.status = movie.status === 1 ? 0 : 1;

    // Call the API to update the movie status in the database
    this.http.put<any>(`https://api.tgv.syaznee.com/movies/${movie.movie_id}/status`, { status: movie.status }).subscribe(
      () => {
        console.log('Status updated successfully');
      },
      (error) => {
        console.error('Error updating status:', error);
        // Revert the status back in case of an error
        movie.status = movie.status === 1 ? 0 : 1;
      }
    );
  }

  onEdit(movie: any) {
    console.log('Selected movie:', movie);

    if (movie && typeof movie.movie_id === 'number') {
      // Navigate to the edit-movie component with the movie ID as a parameter
      this.router.navigate(['/editMovie', movie.movie_id]);
    } else {
      console.error('Invalid movie ID.');
    }
  }

  onDelete(movieId: number) {
    const confirmation = window.confirm('Are you sure you want to delete this movie?');
    if (confirmation) {
      this.http.delete<any>(`https://api.tgv.syaznee.com/movies/${movieId}`).subscribe(
        (response) => {
          console.log('Movie deleted from the database:', response);
          this.movies = this.movies.filter((movie) => movie.movie_id !== movieId);
        },
        (error) => {
          console.error('Error deleting movie:', error);
        }
      );
    }
  }

}
