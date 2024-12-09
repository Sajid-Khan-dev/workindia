CREATE DATABASE irctc_workindia;
USE irctc_workindia;

-------------------------------------------------------------

CREATE TABLE Login (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role ENUM('user', 'admin') NOT NULL
);

INSERT INTO Users (name, username, password, role) VALUES
('User', 'user', 'pa$$word', 'user'),
('Admin', 'admin', 'admIn', 'admin');

-------------------------------------------------------------

CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE
);

INSERT INTO Users (username, password, user_type, name, email) VALUES
('angelika_thomas', 'ang123', 'user', 'Angelika', 'angelika@example.com'),
('sophia_j', 'sop123', 'user', 'Sophia', 'sophia@example.com'),
('asha_verma', 'ash123', 'user', 'Asha', 'asha@example.com');

-------------------------------------------------------------

CREATE TABLE Trains (
    id INT AUTO_INCREMENT PRIMARY KEY,
    train_name VARCHAR(255) NOT NULL,
    source VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    total_seats INT NOT NULL
);


INSERT INTO Trains (train_name, source, destination, total_seats) VALUES
('Godavari Express', 'Hyderabad', 'Vijayawada', 1800),
('Aravali Express', 'Ahmedabad', 'Jaipur', 1600),
('Kashi Vishwanath Express', 'Lucknow', 'Varanasi', 2400);

-------------------------------------------------------------

CREATE TABLE seat_availability (
    id INT AUTO_INCREMENT PRIMARY KEY,
    train_id INT NOT NULL,
    available_seats INT NOT NULL,
    FOREIGN KEY (train_id) REFERENCES trains(id) ON DELETE CASCADE
);

INSERT INTO seat_availability (train_id, available_seats) VALUES
(1, 1800), 
(2, 1600),
(3, 2400); 

-------------------------------------------------------------

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    train_id INT NOT NULL,
    booking_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_det(id) ON DELETE CASCADE,
    FOREIGN KEY (train_id) REFERENCES trains(id) ON DELETE CASCADE
);

-------------------------------------------------------------

CREATE TABLE booking_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    seat_number INT NOT NULL,
    status ENUM('booked', 'available') NOT NULL DEFAULT 'available',
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-------------------------------------------------------------