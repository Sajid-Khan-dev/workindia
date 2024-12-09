const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "irctc_workindia",
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
        return;
    }
    console.log("Connected to MySQL database!");
});


app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    const query = "SELECT * FROM Users WHERE username = ? AND password = ?";
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error("Error during login:", err);
            res.status(500).send("Server error");
            return;
        }

        if (results.length === 1) {
            const user = results[0];
            res.json({ role: user.role, name: user.name });
        } else {
            res.status(401).send("Invalid credentials");
        }
    });
});

app.get("/api/trains", (req, res) => {
    const { source, destination } = req.query;

    // Validate inputs
    if (!source || !destination) {
        return res.status(400).send("Source and destination are required.");
    }

    
    const query = `
        SELECT t.*, sa.available_seats
        FROM trains t
        JOIN seat_availability sa ON t.id = sa.train_id
        WHERE t.source = ? AND t.destination = ?;
    `;

    db.query(query, [source, destination], (err, results) => {
        if (err) {
            console.error("Error fetching trains:", err);
            return res.status(500).send("Server error");
        }
        console.log(results);
        res.json(results);
    });
});


app.post("/api/bookings", (req, res) => {
    const { user_id, train_id, booking_date } = req.body;

    
    db.beginTransaction((err) => {
        if (err) {
            console.error("Error starting transaction:", err);
            return res.status(500).send("Server error");
        }

       
        const checkSeatsQuery = "SELECT available_seats FROM seat_availability WHERE train_id = ? FOR UPDATE";
        db.query(checkSeatsQuery, [train_id], (err, results) => {
            if (err) {
                console.error("Error checking seat availability:", err);
                return db.rollback(() => {
                    res.status(500).send("Server error");
                });
            }

            if (results.length === 0) {
                console.log(`No train found with train_id: ${train_id}`);
                return db.rollback(() => {
                    res.status(400).send("Train not found.");
                });
            }

            const availableSeats = results[0].available_seats;

            console.log(`Available seats for train_id ${train_id}: ${availableSeats}`);

            
            if (availableSeats <= 0) {
                return db.rollback(() => {
                    res.status(400).send("No seats available.");
                });
            }

           
            const bookingQuery = "INSERT INTO bookings (user_id, train_id, booking_date) VALUES (?, ?, ?)";
            db.query(bookingQuery, [user_id, train_id, booking_date], (err, bookingResults) => {
                if (err) {
                    console.error("Error making booking:", err);
                    return db.rollback(() => {
                        res.status(500).send("Server error");
                    });
                }

               
                const updateSeatsQuery = "UPDATE seat_availability SET available_seats = available_seats - 1 WHERE train_id = ? AND available_seats > 0";
                db.query(updateSeatsQuery, [train_id], (updateErr, updateResults) => {
                    if (updateErr) {
                        console.error("Error updating seat availability:", updateErr);
                        return db.rollback(() => {
                            res.status(500).send("Server error");
                        });
                    }

                    
                    const getTrainDetailsQuery = `
                        SELECT t.train_name, t.source, t.destination 
                        FROM trains t WHERE t.id = ?`;
                    db.query(getTrainDetailsQuery, [train_id], (trainErr, trainResults) => {
                        if (trainErr) {
                            console.error("Error fetching train details:", trainErr);
                            return db.rollback(() => {
                                res.status(500).send("Server error");
                            });
                        }

                        const trainDetails = trainResults[0];

                        
                        db.commit((commitErr) => {
                            if (commitErr) {
                                console.error("Error committing transaction:", commitErr);
                                return db.rollback(() => {
                                    res.status(500).send("Server error");
                                });
                            }

                            
                            res.json({
                                message: "Booking successful",
                                booking_id: bookingResults.insertId,
                                train_name: trainDetails.train_name,
                                source: trainDetails.source,
                                destination: trainDetails.destination,
                                booking_date: booking_date,
                                remaining_seats: availableSeats - 1,
                            });
                        });
                    });
                });
            });
        });
    });
});


app.get("/api/bookings/:userId", (req, res) => {
    const userId = req.params.userId;

    const query = `
        SELECT b.id, t.train_name, t.source, t.destination, b.booking_date 
        FROM bookings b
        JOIN trains t ON b.train_id = t.id
        WHERE b.user_id = ?;
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error("Error fetching bookings:", err);
            return res.status(500).send("Server error");
        }
        res.json(results);
    });
});


app.get("/api/payments/:bookingId", (req, res) => {
    const bookingId = req.params.bookingId;

    const query = "SELECT payment_status, payment_date FROM payments WHERE booking_id = ?";
    db.query(query, [bookingId], (err, results) => {
        if (err) {
            console.error("Error fetching payment details:", err);
            return res.status(500).send("Server error");
        }
        res.json(results);
    });
});


app.post("/api/trains", checkAdmin, (req, res) => {
    const { train_name, source, destination, total_seats } = req.body;

    if (!train_name || !source || !destination || !total_seats) {
        return res.status(400).send("All fields are required.");
    }

    const query = "INSERT INTO trains (train_name, source, destination) VALUES (?, ?, ?)";
    db.query(query, [train_name, source, destination], (err, results) => {
        if (err) {
            logError(err, "Trains API - Add New Train");
            return res.status(500).send("Server error");
        }

        const train_id = results.insertId;

        const seatQuery = "INSERT INTO seat_availability (train_id, available_seats) VALUES (?, ?)";
        db.query(seatQuery, [train_id, total_seats], (seatErr, seatResults) => {
            if (seatErr) {
                logError(seatErr, "Trains API - Add Seat Availability");
                return res.status(500).send("Server error");
            }

            res.json({ message: "Train added successfully", train_id });
        });
    });
});

app.put("/api/trains/seats/:trainId", checkAdmin, (req, res) => {
    const { trainId } = req.params;
    const { available_seats } = req.body;

    if (available_seats === undefined) {
        return res.status(400).send("Available seats must be specified.");
    }

    const query = "UPDATE seat_availability SET available_seats = ? WHERE train_id = ?";
    db.query(query, [available_seats, trainId], (err, results) => {
        if (err) {
            logError(err, "Trains API - Update Seats");
            return res.status(500).send("Server error");
        }

        res.json({ message: "Seat availability updated successfully" });
    });
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
