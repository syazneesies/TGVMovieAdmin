const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const crypto = require('crypto');
const fs = require('fs');
const multer = require('multer');
const path = require('path');


// Middleware
app.use(express.static(path.join(__dirname, 'public')));
// Define an array of allowed origins
const allowedOrigins = [
  'http://localhost:62687', 'http://localhost:61762', 'http://localhost:4200', 'https://tgv.syaznee.com',
];

// CORS middleware with a custom origin validation function
app.use(cors({
  origin: function (origin, callback) {
    // Check if the request's origin is in the allowed origins list
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));

// Set the maximum payload size to 50MB (adjust as needed)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Intergrate session
const secretKey = crypto.randomBytes(32).toString('hex');

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Create a MySQL connection
// Localhost
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'tgvcinema'
// });

// Production
const connection = mysql.createConnection({
  host: 'mdb',
  user: 'tgvsystem',
  password: 'tgv',
  database: 'tgvcinema'
});

connection.connect((error) => {
  if (error) {
    console.error('Error connecting to the database:', error);
    return;
  }
  console.log('Connected to the database');
});

//get number of total bookings
app.get('/getTotalBookedTickets', (req, res) => {
  connection.query('SELECT COUNT(*) AS totalBookings FROM bookings', (error, results) => {
    if (error) {
      console.error('Error querying database:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const totalBookings = results[0].totalBookings;
    res.status(200).json({ totalBookings });
  });
});

//get number of uncollected tickets
app.get('/getUncollectedTickets', (req, res) => {
  connection.query('SELECT COUNT(*) AS uncollectedTickets FROM bookings WHERE status = 0', (error, results) => {
    if (error) {
      console.error('Error querying database:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const uncollectedTickets = results[0].uncollectedTickets;
    res.status(200).json({ uncollectedTickets });
  });
});

//get number of active Movie
app.get('/getActiveMovie', (req, res) => {
  connection.query('SELECT COUNT(*) AS activeMovie FROM movies WHERE status = 1', (error, results) => {
    if (error) {
      console.error('Error querying database:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length === 0) {
      // No movies with status 0 found
      res.status(200).json({ activeMovie: 0 });
    } else {
      const activeMovie = results[0].activeMovie;
      res.status(200).json({ activeMovie });
    }
  });
});

//get number of inactive Movie
app.get('/getInactiveMovie', (req, res) => {
  connection.query('SELECT COUNT(*) AS inactiveMovie FROM movies WHERE status = 0', (error, results) => {
    if (error) {
      console.error('Error querying database:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length === 0) {
      // No movies with status 0 found
      res.status(200).json({ inactiveMovie: 0 });
    } else {
      const inactiveMovie = results[0].inactiveMovie;
      res.status(200).json({ inactiveMovie });
    }

  });
});

// API endpoint for member register
app.post('/register', async (req, res) => {

  try {
    const { name, email, password, phoneNumber, birthday } = req.body;
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user object
    const user = {name, email, password: hashedPassword, role: 'member', phoneNumber, birthday};
    // Insert the user into the "users" table
    connection.query('INSERT INTO users SET ?', user, (error, results) => {
      if (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.status(201).json({ message: 'Registration successful', redirect: '/login' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


// API endpoint for member Login
app.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    connection.query('SELECT * FROM users WHERE email = ?', email, (error, results) => {
      if (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      if (results.length === 0) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const user = results[0];

      // Compare the stored hashed password with the provided plain-text password
      bcrypt.compare(password, user.password, (err, passwordMatch) => {
        if (err) {
          console.error('Error comparing passwords:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }

        if (!passwordMatch) {
          res.status(401).json({ error: 'Invalid credentials' });
          return;
        }

        // Generate a JWT token with the user's role and ID
        const token = jwt.sign({ userId: user.user_id, name: user.name, email: user.email, role: user.role }, 'secretKey');

        // Redirect based on user role
        if (user.role === 'member') {
          res.status(200).json({ message: 'Login successful', redirect: '/member', token: token, userId: user.user_id, role: user.role });
        } else if (user.role === 'admin') {
          res.status(200).json({ message: 'Admin Login successful', redirect: '/dashboard', token: token, userId: user.user_id, role: user.role });
        } else {
          res.status(401).json({ error: 'Invalid credentials' });
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

//API for admin get all bookings
app.get('/bookings/admin', (req, res) => {
  // Query to retrieve all rows from the booking table
  const query = 'SELECT bookings.*, movies.title, movies.release_date FROM bookings JOIN movies ON bookings.movieID = movies.movie_ID;';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing the query:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res.json(results);
  });
});

// Update the POST route for bookings
app.post('/bookings', (req, res) => {
  const booking = req.body;

  connection.query('INSERT INTO bookings SET ?', booking, (error, results) => {
    if (error) {
      console.error('Error saving booking:', error.message);
      res.status(500).json({ message: 'Failed to save booking. Please try again later.' });
    } else {
      if (results.affectedRows > 0) {
        console.log('Booking saved:', results);
        res.status(200).json({ message: 'Booking saved successfully.' });
      } else {
        console.error('Error saving booking: No rows affected.');
        res.status(500).json({ message: 'Failed to save booking. Please try again later.' });
      }
    }
  });
});


//get all booked tickets
app.get('/bookedTickets', (req, res) => {

  const query = 'SELECT bookings.*, movies.title, movies.release_date FROM bookings JOIN movies ON bookings.movieID = movies.movie_ID WHERE bookings.status = 0';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing the query:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res.json(results);
  });
});

//get all collected tickets
app.get('/collectedTickets', (req, res) => {

  const query = 'SELECT bookings.*, movies.title, movies.release_date FROM bookings JOIN movies ON bookings.movieID = movies.movie_ID WHERE bookings.status = 1';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing the query:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res.json(results);
  });
});

//update booking status from admin side
app.put('/booking/status/:id', (req, res) => {
  const bookingID = req.params.id;
  const status = req.body.newStatus;

  connection.query('SELECT * FROM bookings WHERE bookingID = ?', bookingID, (error, results) => {
    if (error) {
      console.error('Error retrieving booking:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    // Update the booking status
    connection.query('UPDATE bookings SET status = ? WHERE bookingID = ?', [status, bookingID], (error, updateResults) => {
      if (error) {
        console.error('Error updating booking table:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      res.status(200).json({ message: 'Ticket updated successfully' });
    });
  });
});

//API endpoint for member profile
app.get('/profile/:userId', (req, res) => {
  const userId = req.params.userId;

  connection.query('SELECT * FROM users WHERE user_id = ?', userId, (error, results) => {
    if (error) {
      console.error('Error retrieving member profile:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Member profile not found' });
      return;
    }

    const memberProfile = results[0];
    res.status(200).json(memberProfile);
  });
});

// API end for edit member profile
app.put('/memberEditprofile/:userId', (req, res) => {
  const userId = req.params.userId;
  const updatedProfile = req.body;
  console.log(userId);

  // Check if the profile exists before updating
  connection.query('SELECT * FROM users WHERE user_id = ?', userId, (error, results) => {
    if (error) {
      console.error('Error retrieving member profile:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    // Profile found, update the profile
    connection.query('UPDATE users SET ? WHERE user_id = ?', [updatedProfile, userId], (error, results) => {
      if (error) {
        console.error('Error updating member profile:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      res.status(200).json({ message: 'Profile updated successfully' });
    });
  });
});

// API endpoint for my bookings page
app.get('/memberBookings/:userId', (req, res) => {
  const userId = req.params.userId;

  connection.query('SELECT * FROM bookings WHERE user_ID = ?', userId, (error, results) => {
    if (error) {
      console.error('Error retrieving bookings:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Replace 'status' integer value with corresponding labels
    results.forEach((booking) => {
      booking.status = booking.status === 0 ? 'Pending' : 'Approved';
    });


    res.status(200).json(results);
  });
});


// app.listen(3001, () => {
//   console.log('Server started on port 3001');
// });


// Protected route example
app.get('/protected', (req, res) => {
  res.send('Protected route accessed!');
});


// Handle GET requests for /api/login
app.get('/api/login', (req, res) => {
  res.status(405).json({ error: 'Method Not Allowed. Login Properly.' });
});

app.get('/member', (req, res) => {
  console.log('Here');
  res.status(405).json({ error: 'Unable to access.' });
});

// Handle GET requests for /movies
app.get('/movies', (req, res) => {
  const query = 'SELECT movie_id, title, genre, duration, release_date, director, description, poster_image_path, status FROM movies';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching movies:', error.message);
      res.status(500).json({ error: 'Failed to fetch movies' });
      return;
    }

    const formattedResults = results.map((movie) => {
      const imageData = Buffer.from(movie.poster_image_path).toString('base64');
      //console.log(imageData);

      // Convert the Buffer to a string and then replace double occurrences of /assets/poster/
      const fileName = movie.poster_image_path.toString().replace('/assets/poster//assets/poster/', '/assets/poster/');
      console.log(fileName);

      // Create a new object with additional fields
      return {
        ...movie,
        posterImagePath: fileName,
        data: imageData,
        type: 'Buffer',
      };
    });

    res.json(formattedResults);
  });
});


// Set up the destination and filename for the uploaded image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/assets/poster'); // Specify the folder where you want to save the images in the Angular app
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExt = path.extname(file.originalname);
    const fileName = 'poster_image_path-' + uniqueSuffix + fileExt;
    cb(null, fileName);
  }
});

const upload = multer({ storage: storage });

// API endpoint to add a new movie
app.post('/api/movies', upload.single('poster_image_path'), (req, res) => {
  const movie = req.body;
  movie.poster_image_path = '/assets/poster/' + req.file.filename;

  // Set the default status to 1 (active) for the new movie
  movie.status = 1;

  // Perform logic to insert the movie into the database
  const sql =
    'INSERT INTO movies (title, genre, duration, release_date, director, description, poster_image_path, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [
    movie.title,
    movie.genre,
    movie.duration,
    movie.release_date,
    movie.director,
    movie.description,
    movie.poster_image_path,
    movie.status,
  ];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting movie:', err.message);
      res.status(500).json({ error: 'Failed to add movie' });
      return;
    }

    console.log('Movie added to the database:', result);
    res.status(200).json({ message: 'Movie added successfully' });
  });
});

// Route to update a movie record
app.put('/movies/:id', upload.single('posterImage'), (req, res) => {
  const movieId = req.params.id;
  const { title, genre, duration, release_date, director, description } = req.body;
  const updatedMovie = {
    title,
    genre,
    duration,
    release_date,
    director,
    description,
  };

  // Check if a new poster image is uploaded
  if (req.file) {
    updatedMovie.poster_image_path = '/assets/poster/' + req.file.filename;
  }

  const updateMovieQuery =
    'UPDATE movies SET title=?, genre=?, duration=?, release_date=?, director=?, description=?, poster_image_path=? WHERE movie_id=?';

  connection.query(
    updateMovieQuery,
    [
      updatedMovie.title,
      updatedMovie.genre,
      updatedMovie.duration,
      updatedMovie.release_date,
      updatedMovie.director,
      updatedMovie.description,
      updatedMovie.poster_image_path, // Use updatedMovie.poster_image_path here
      movieId,
    ],
    (err, result) => {
      if (err) {
        console.error('Error updating movie:', err);
        res.status(500).json({ error: 'Error updating movie' });
      } else {
        console.log('Movie updated successfully');
        res.status(200).json({ message: 'Movie updated successfully' });
      }
    }
  );
});

// Route to update the status of a movie
app.put('/movies/:id/status', (req, res) => {
  const movieId = req.params.id;
  const { status } = req.body;

  // Perform logic to update the status of the movie in the database
  const updateStatusQuery = 'UPDATE movies SET status = ? WHERE movie_id = ?';

  connection.query(updateStatusQuery, [status, movieId], (error, result) => {
    if (error) {
      console.error('Error updating movie status:', error);
      res.status(500).json({ error: 'Error updating movie status' });
    } else {
      console.log('Movie status updated successfully');
      res.status(200).json({ message: 'Movie status updated successfully' });
    }
  });
});


// Route to get a specific movie record
app.get('/movies/:id', (req, res) => {
  const movieId = req.params.id;

  const getMovieQuery = 'SELECT * FROM movies WHERE movie_id = ?';

  connection.query(getMovieQuery, [movieId], (err, result) => {
    if (err) {
      console.error('Error getting movie:', err);
      res.status(500).json({ error: 'Error getting movie' });
    } else {
      if (result.length === 0) {
        res.status(404).json({ error: 'Movie not found' });
      } else {
        const movie = result[0];
        const posterImagePath = `${movie.poster_image_path}`;
        const status = movie.status === 1 ? 'Active' : 'Inactive'; // Convert 1 to 'Active' and 0 to 'Inactive'
        res.status(200).json({ ...movie, posterImagePath, status });
      }
    }
  });
});

// API endpoint to delete a movie
app.delete('/movies/:movie_id', (req, res) => {
  const movieId = req.params.movie_id;

  // Perform logic to delete the movie from the database
  const sql = 'DELETE FROM movies WHERE movie_id = ?';

  connection.query(sql, [movieId], (err, result) => {
    if (err) {
      console.error('Error deleting movie:', err.message);
      res.status(500).json({ error: 'Failed to delete movie' });
      return;
    }

    console.log('Movie deleted from the database:', result);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Movie deleted successfully' });
    } else {
      res.status(404).json({ message: 'Movie not found or already deleted' });
    }
  });
});


app.post('/addStaff', async (req, res) => {
  try {
    const { name, phoneNumber, birthday, email, password, positions } = req.body;
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user object
    const user = {name, email, password: hashedPassword, role: 'admin', positions, phoneNumber, birthday};
    // Insert the user into the "users" table
    connection.query('INSERT INTO users SET ?', user, (error, results) => {
      if (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.status(201).json({ message: 'Registration successful', redirect: '/manageAdmin' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

//get all staff
app.get('/staff', (req, res) => {

  const query = 'SELECT * FROM users WHERE role = "admin" ';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing the query:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res.json(results);
  });
});

//delete staff
app.delete('/deleteStaff/:userID', (req, res) => {
  const userId = req.params.userID;

  // Perform logic to delete the movie from the database
  const sql = 'DELETE FROM users WHERE user_id = ?';

  connection.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err.message);
      res.status(500).json({ error: 'Failed to delete user' });
      return;
    }

    console.log('User deleted from the database:', result);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Movie User successfully' });
    } else {
      res.status(404).json({ message: 'User not found or already deleted' });
    }
  });
});

// HTTP PUT method to update staff details
app.put('/updateStaff/:userId', async(req, res) => {
  const userId = req.params.userId;
  const updatedStaffData = req.body;

  // Check if the isPasswordChanged field exists and is true
  if (updatedStaffData.isPasswordChanged === true) {
    // Hash the password
    try {
      const hashedPassword = await bcrypt.hash(updatedStaffData.password, 10);
      updatedStaffData.password = hashedPassword;
      console.log(updatedStaffData.password);
    } catch (error) {
      console.error('Error hashing password:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
  }

  delete updatedStaffData.isPasswordChanged;

  connection.query('UPDATE users SET ? WHERE user_id = ?', [updatedStaffData, userId], (error, results) => {
    if (error) {
      console.error('Error updating staff details:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.affectedRows === 0) {
      // Staff with the given userId not found
      res.status(404).json({ error: 'Staff not found' });
      return;
    }
    //console.log(query);
    res.status(200).json({ message: 'Staff updated successfully', redirect: '/manageAdmin' });
  });
});


// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

