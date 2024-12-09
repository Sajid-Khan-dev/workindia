import React, { useState } from "react";
import axios from "axios";
import "./UserDashboard.css";

const UserDashboard = () => {
    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [trains, setTrains] = useState([]);
    const [error, setError] = useState(null);
    const [bookingMessage, setBookingMessage] = useState(null);
    const [bookingDetails, setBookingDetails] = useState(null);

    
    const handleSearch = () => {
        if (!source || !destination) {
            setError("Please enter both source and destination.");
            return;
        }
        setError(null);
        setBookingMessage(null);

        
        axios
            .get("http://localhost:5000/api/trains", { params: { source, destination } })
            .then((response) => {
                setTrains(response.data);
            })
            .catch((err) => {
                setError("Error fetching trains.");
                console.error(err);
            });
    };

    const handleBookSeat = (trainId) => {
        const userId = 1; 
        const bookingDate = new Date().toISOString().slice(0, 10);

        axios
            .post("http://localhost:5000/api/bookings", { user_id: userId, train_id: trainId, booking_date: bookingDate })
            .then((response) => {
                setBookingMessage(`Booking successful for Train ID: ${trainId}. Remaining seats: ${response.data.remaining_seats}`);
                setBookingDetails({
                    booking_id: response.data.booking_id,
                    train_name: response.data.train_name,
                    source: response.data.source,
                    destination: response.data.destination,
                    booking_date: response.data.booking_date,
                    remaining_seats: response.data.remaining_seats,
                });
                handleSearch();
            })
            .catch((err) => {
                setError(err.response?.data || "Error while booking. Try again.");
                console.error(err);
            });
    };

    return (
        <div className="dashboard">
            <h1>Welcome, User!</h1>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Enter Source"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter Destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                />
                <button onClick={handleSearch}>Search Trains</button>
            </div>
            {error && <p className="error">{error}</p>}
            {bookingMessage && <p className="success">{bookingMessage}</p>}
            <h2>Available Trains</h2>
            {trains.length > 0 ? (
                <ul className="train-list">
                    {trains.map((train) => (
                        <li key={train.id} className="train-item">
                            <div>
                                <strong>{train.train_name}</strong> - {train.source} to {train.destination}
                            </div>
                            <div>Seats Available: {train.available_seats}</div>
                            {train.available_seats > 0 ? (
                                <button
                                    onClick={() => handleBookSeat(train.id)}
                                    className="book-btn"
                                >
                                    Book Seat
                                </button>
                            ) : (
                                <span className="no-seats">No seats available</span>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No trains available for the selected route.</p>
            )}

            {bookingDetails && (
                <div>
                    <h3>Booking Details</h3>
                    <p>Booking ID: {bookingDetails.booking_id}</p>
                    <p>Train Name: {bookingDetails.train_name}</p>
                    <p>Source: {bookingDetails.source}</p>
                    <p>Destination: {bookingDetails.destination}</p>
                    <p>Booking Date: {bookingDetails.booking_date}</p>
                    <p>Remaining Seats: {bookingDetails.remaining_seats}</p>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
