import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import Login from "./components/Login";

const App = () => {
   return (
       <Router>
           <Routes>
               <Route path="/" element={<Login/>} />
               <Route path="/user-dashboard" element={<UserDashboard />} />
               <Route path="/admin-dashboard" element={<AdminDashboard />} />
           </Routes>
       </Router>
   );
};

export default App;
