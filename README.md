# Railway Management System

Greetings! I am excited to present my **Railway Management System** project, inspired by the IRCTC portal. While this is an attempt to replicate the core functionalities, the project is designed to demonstrate a seamless blend of **front-end** and **back-end** technologies. Below are the details of the technologies used and the steps to set it up:

## Technologies Used

- **Frontend**: ReactJS
- **Backend**: Node.js
- **Database**: MySQL

## Step-by-Step Setup Instructions

### Step 1: Database Initialization

1. Open your MySQL interface (e.g. : MySQL).
2. Copy and execute the following SQL script to set up the database structure and seed initial data:

```sql
CREATE DATABASE train_workindia;
USE train_workindia;
```
---

**Users**: Stores user credentials and roles (user/admin) for authentication.
```sql
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role ENUM('user', 'admin') NOT NULL
);

INSERT INTO Users (name, username, password, role) VALUES
('User', 'user', 'password123', 'user'),
('Admin Boss', 'adminboss', 'adminpass', 'admin');
```

---
**user_det**: Stores detailed user information such as name, username, password, user type (admin/user), and email.
```sql
CREATE TABLE user_det (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE
);

INSERT INTO user_det (username, password, user_type, name, email) VALUES
('md_sajid', 'saj123', 'user', 'Sajid', 'sajid@example.com'),
('sophia_j', 'sop123', 'user', 'Sophia', 'sophia@example.com'),
('asha_verma', 'ash123', 'user', 'Asha', 'asha@example.com');
```


---
**trains**: Stores details about the trains, including train name, source, destination, and total seat count.
```sql
CREATE TABLE trains (
    id INT AUTO_INCREMENT PRIMARY KEY,
    train_name VARCHAR(255) NOT NULL,
    source VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    total_seats INT NOT NULL
);

INSERT INTO trains (train_name, source, destination, total_seats) VALUES
('Rajdhani Express', 'New Delhi', 'Mumbai', 500),
('Shatabdi Express', 'Chennai', 'Bangalore', 300),
('Duronto Express', 'Kolkata', 'Pune', 400);
```


---
**seat_availability**: Tracks available seats for each train by referencing the train's ID.
```sql
CREATE TABLE seat_availability (
    id INT AUTO_INCREMENT PRIMARY KEY,
    train_id INT NOT NULL,
    available_seats INT NOT NULL,
    FOREIGN KEY (train_id) REFERENCES trains(id) ON DELETE CASCADE
);

INSERT INTO seat_availability (train_id, available_seats) VALUES
(1, 500), 
(2, 300), 
(3, 400); 
```


---
**bookings**: Stores booking records, linking users to trains and recording the booking date.
```sql
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    train_id INT NOT NULL,
    booking_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_det(id) ON DELETE CASCADE,
    FOREIGN KEY (train_id) REFERENCES trains(id) ON DELETE CASCADE
);
```


---
**booking_details**: Stores details for each booking, including seat number and booking status (booked/available).
```sql
CREATE TABLE booking_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    seat_number INT NOT NULL,
    status ENUM('booked', 'available') NOT NULL DEFAULT 'available',
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);
```
---

## Step 2: Backend Setup

1. Navigate to the backend directory in your terminal:

    ```bash
    cd backend
    ```

2. Install necessary dependencies:

    ```bash
    npm init -y
    npm install express sqlite3 cors mysql2 body-parser
    ```

3. Open `server.js` in your code editor and configure the MySQL password to match your local machine settings.

4. Start the backend server:

    ```bash
    node server.js
    ```

---

## Step 3: Frontend Setup

1. Navigate to the frontend directory:

    ```bash
    cd frontend
    ```

2. Install the required dependencies:

    ```bash
    npm install react-router-dom axios
    ```

3. Start the frontend server:

    ```bash
    npm start
    ```

---

## Step 4: Login Credentials

- **User Login**:
    - Username: `user`
    - Password: `password123`

- **Admin Login**:
    - Username: `adminboss`
    - Password: `adminpass`

---

## Step 5: User Dashboard

When using the dashboard, enter the following predefined train routes to test functionality:

- **Source**: New Delhi → **Destination**: Mumbai
- **Source**: Kolkata → **Destination**: Pune
- **Source**: Chennai → **Destination**: Bangalore

---

## Project Enhancements

This project serves as a foundation for implementing a **Railway Management System**. Feel free to enhance its features, such as adding:

- Dynamic booking systems
- Real-time seat availability checks
- User-friendly UI components

