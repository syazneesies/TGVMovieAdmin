import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css']
})
export class AddMovieComponent {

  movie: any = {};
  showSuccessMessage: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router
    ) {}

  goBack(){
    this.router.navigate(['/manageMovie']);
  }
  addMovie() {

    if (this.movie.imageFile) {
      this.saveMovieWithImage();
    } else {
      this.saveMovie();
    }
  }

  saveMovieWithImage() {
    const formData = new FormData();
    formData.append('title', this.movie.title);
    formData.append('genre', this.movie.genre);
    formData.append('duration', this.movie.duration);
    formData.append('release_date', this.movie.release_date);
    formData.append('director', this.movie.director);
    formData.append('description', this.movie.description);
    formData.append('poster_image_path', this.movie.imageFile); // Ensure this field name is the same as expected by Multer

    this.http
      .post<any>('https://api.tgv.syaznee.com/api/movies', formData)
      .subscribe(
        (response) => {
          console.log(response.message);
          this.resetFormAndShowSuccessMessage();
        },
        (error) => {
          console.error('Error adding movie:', error.error);
        }
      );
  }
  saveMovie() {
    this.http
      .post<any>('https://api.tgv.syaznee.com/api/movies', this.movie)
      .subscribe(
        (response) => {
          console.log(response.message);
          this.resetFormAndShowSuccessMessage();
        },
        (error) => {
          console.error('Error adding movie:', error.error);
        }
      );
  }

  onImageChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      this.movie.imageFile = file;
    }
  }

  resetFormAndShowSuccessMessage() {
    this.movie = {};
    this.showSuccessMessage = true;
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 3000);
  }
}
