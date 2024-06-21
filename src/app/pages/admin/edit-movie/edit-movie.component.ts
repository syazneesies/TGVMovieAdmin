import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-movie',
  templateUrl: './edit-movie.component.html',
  styleUrls: ['./edit-movie.component.css']
})
export class EditMovieComponent implements OnInit, OnDestroy {
  movieId: number;
  movieDetailsSubscription: Subscription;
  editMode: boolean = false;
  editForm: FormGroup;
  selectedPosterImage: File | null = null;
  currentPosterImage: string | null = null;
  posterImagePath: any;


  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.editForm = this.fb.group({
      movie_id: [{ value: '', disabled: true }, Validators.required], // Disabled movie_id control
      title: ['', Validators.required], // Remove disabled attribute here
      genre: ['', Validators.required], // Remove disabled attribute here
      duration: ['', Validators.required], // Remove disabled attribute here
      release_date: ['', Validators.required], // Remove disabled attribute here
      director: ['', Validators.required], // Remove disabled attribute here
      description: ['', Validators.required], // Remove disabled attribute here
      posterImage: ['']
    });
  }

  ngOnInit() {
    this.movieId = +this.route.snapshot.params['id'];
    if (isNaN(this.movieId)) {
      console.error('Invalid movie ID.');
      // Redirect the user back to the ManageMovieComponent or any other desired page
      this.router.navigate(['/manageMovie']);
    } else {
      this.loadMovieDetails();
    }
  }

  ngOnDestroy() {
    if (this.movieDetailsSubscription) {
      this.movieDetailsSubscription.unsubscribe();
    }
    // Release the object URL when the component is destroyed
    if (this.currentPosterImage) {
      URL.revokeObjectURL(this.currentPosterImage);
    }
  }

  loadMovieDetails() {
    this.movieDetailsSubscription = this.http.get<any>(`https://api.tgv.syaznee.com/movies/${this.movieId}`).subscribe(
      (data) => {
        console.log('Movie details:', data);
        console.log('Poster Image Blob:', data.posterImagePath);

        if (data.posterImagePath) {
          // Remove "src" from the beginning of the path if present
          let posterImagePath = data.posterImagePath;
            this.currentPosterImage = posterImagePath;

        }

        this.editForm.patchValue({
          movie_id: data.movie_id,
          title: data.title,
          genre: data.genre,
          duration: data.duration,
          release_date: this.formatDate(data.release_date, 'yyyy-MM-dd'), // Use 'yyyy-MM-dd' format
          director: data.director,
          description: data.description,
          posterImage: null
        });

      },
      (error) => {
        console.error('Error loading movie details:', error);
      }
    );
  }

  // Helper function to convert Uint8Array to base64 string
  arrayBufferToBase64(buffer: Uint8Array): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }


  enableEditMode() {
    this.editMode = true;
    // Enable the 'release_date' form control when edit mode is true
    this.editForm.get('release_date')?.enable();
    // Enable all other form controls if needed
    Object.keys(this.editForm.controls).forEach((key) => {
      if (key !== 'release_date') {
        this.editForm.controls[key].enable();
      }
    });
  }

  cancelEdit() {
  this.editMode = false;
  this.loadMovieDetails(); // Reset form data to original values
  // Disable the 'release_date' form control when edit mode is false
  this.editForm.get('release_date')?.disable();
  // Disable all other form controls if needed
  Object.keys(this.editForm.controls).forEach((key) => {
    if (key !== 'release_date') {
      this.editForm.controls[key].disable();
    }
  });
  }

  onPosterImageChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedPosterImage = inputElement.files[0];
    }
  }

  saveMovieDetails() {
    if (this.editForm.valid) {
      const formData = new FormData();
      formData.append('title', this.editForm.value.title);
      formData.append('genre', this.editForm.value.genre);
      formData.append('duration', this.editForm.value.duration);
      formData.append('release_date', this.editForm.value.release_date);
      formData.append('director', this.editForm.value.director);
      formData.append('description', this.editForm.value.description);

      // Append the poster image to the FormData
      if (this.selectedPosterImage) {
        formData.append('posterImage', this.selectedPosterImage, this.selectedPosterImage.name);
      }

      this.http.put<any>(`https://api.tgv.syaznee.com/movies/${this.movieId}`, formData).subscribe(
        (response) => {
          console.log('Movie updated successfully:', response);
          this.editMode = false; // Disable edit mode
          this.loadMovieDetails(); // Refresh movie details
        },
        (error) => {
          console.error('Error updating movie:', error);
        }
      );
    }
  }

  goBack() {
    // Use the Router to navigate back to the manage-movie page
    this.router.navigate(['/manageMovie']);
  }

  private formatDate(dateStr: string, format: string): string {
    if (dateStr === null) {
      return ''; // or any other default value you prefer when the date is null
    }
    const dateObj = new Date(dateStr);
    return this.datePipe.transform(dateObj, format)!;
  }

}

