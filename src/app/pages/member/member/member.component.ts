import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';

interface MemberProfile {
  // Define the profile properties here
}

interface Movie {
  movie_id: number;
  title: string;
  genre: string;
  duration: number;
  release_date: string;
  director: string;
  description: string;
  poster_image_path: string;
  status: number;
}

interface Booking {
  bookingID: number;
  movieID : number;
  movieName: string;
  user_ID: number;
  seatQuantity: number;
  status: number;
}

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css'],
})
export class MemberComponent implements OnInit {
  userId: string;
  memberProfile: MemberProfile;
  movies: Movie[] = [];
  successMessage: string = '';
  currentPosterImage: string;


  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer

  ) {}

  ngOnInit() {
    var token = sessionStorage.getItem('token');
    if (!token) {
      this.logout();
    }
    
    this.route.queryParams.subscribe((params) => {
      this.userId = params['userId'];
    });
    this.fetchMovies();
  }


  fetchMovies() {
    this.http.get<any[]>('https://api.tgv.syaznee.com/movies').subscribe(
      (data) => {
        this.movies = data.filter((movie) => movie.status === 1).map((movie) => {
          const movieWithPoster: Movie = {
            movie_id: movie.movie_id,
            title: movie.title,
            genre: movie.genre,
            duration: movie.duration,
            release_date: movie.release_date,
            director: movie.director,
            description: movie.description,
            poster_image_path: movie.posterImagePath,
            status: movie.status, 
          };

          return movieWithPoster;
        });
      },
      (error) => {
        console.error('Error fetching movies:', error);
      }
    );
  }
  

  getMoviePoster(posterImagePath: string): any {
    if (!posterImagePath) {
      // Handle if posterImagePath is not available
      return 'path/to/default/image.jpg'; // Replace with the path to a default image
    }

    // Construct the URL for the image using the correct path
    const imageUrl = `${posterImagePath}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);
  }

    bookMovie(title: string, duration: number, movieID: number) {
      const seatQuantity = window.prompt('Enter seat quantity:');
      if (seatQuantity) {
        const booking: Omit<Booking, 'bookingID'> = {
          movieName: title,
          user_ID: +this.userId,
          seatQuantity: +seatQuantity,
          status: 0,
          movieID: movieID, // Correct the property name to movieID with capital 'D'
        };

        this.http.post('https://api.tgv.syaznee.com/bookings', booking).subscribe(
          (response) => {
            console.log('Booking saved:', response);
            this.successMessage = 'Booking successful!';
            this.snackBar.open('Booking successful!', 'Close', { duration: 2000 });
            setTimeout(() => {
              this.closeConfirmation();
            }, 3000);
          },
          (error) => {
            console.error('Error saving booking:', error);
            // Handle error, display an error message, etc.
          }
        );
      }
    }


  closeConfirmation() {
    this.successMessage = '';
  }

  redirectToMemberPage() {
    this.router.navigate(['/member'], { queryParams: { userId: this.userId } });
  }

  logout(): void {
    // Clear the session storage or remove the token
    sessionStorage.removeItem('token');
    // Redirect to the login page or any other desired page
    this.router.navigate(['/login']);
  }
}
