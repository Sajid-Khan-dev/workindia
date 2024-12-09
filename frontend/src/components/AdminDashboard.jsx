import React, { useState } from "react";
import axios from "axios";
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [trainName, setTrainName] = useState("");
    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [totalSeats, setTotalSeats] = useState("");
    const [trainId, setTrainId] = useState("");
    const [availableSeats, setAvailableSeats] = useState("");
    const [message, setMessage] = useState("");

    // Handle adding a new train
    const handleAddTrain = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:5000/api/trains", {
                train_name: trainName,
                source,
                destination,
                total_seats: totalSeats,
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage("Error adding train.");
        }
    };

    // Handle updating available seats for a train
    const handleUpdateSeats = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(
                `http://localhost:5000/api/trains/seats/${trainId}`,
                { available_seats: availableSeats }
            );
            setMessage(response.data.message);
        } catch (error) {
            setMessage("Error updating seats.");
        }
    };

    return (
        <div>
            <h1>Welcome, Admin!</h1>

            <div>
                <h2>Add a New Train</h2>
                <form onSubmit={handleAddTrain}>
                    <label>
                        Train Name:
                        <input
                            type="text"
                            value={trainName}
                            onChange={(e) => setTrainName(e.target.value)}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Source:
                        <input
                            type="text"
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Destination:
                        <input
                            type="text"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Total Seats:
                        <input
                            type="number"
                            value={totalSeats}
                            onChange={(e) => setTotalSeats(e.target.value)}
                            required
                        />
                    </label>
                    <br />
                    <button type="submit">Add Train</button>
                </form>
            </div>

            <div>
                <h2>Update Train Seats</h2>
                <form onSubmit={handleUpdateSeats}>
                    <label>
                        Train ID:
                        <input
                            type="text"
                            value={trainId}
                            onChange={(e) => setTrainId(e.target.value)}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Available Seats:
                        <input
                            type="number"
                            value={availableSeats}
                            onChange={(e) => setAvailableSeats(e.target.value)}
                            required
                        />
                    </label>
                    <br />
                    <button type="submit">Update Seats</button>
                </form>
            </div>

            {message && <p>{message}</p>}
        </div>
    );
};

export default AdminDashboard;
