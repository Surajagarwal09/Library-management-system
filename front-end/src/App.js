import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Homepage from './components/Homepage';
import BookDetails from './components/Bookdetails';
import AdminBookDetails from './components/admin/AdminBookdetails'; 
import UserProfile from './components/Profilepage';
import BorrowedBooks from './components/Borrowedpage';
import Loginpage from './components/Loginpage';
import Studentregister from './components/Studentregister';
import Staffregister from './components/Staffregister';
import Adminregister from './components/Adminregister'; 
import Navbar from './components/Navbar';
import Adminhomepage from './components/admin/Adminhome';
import Books from './components/admin/Books';
import AddBook from './components/admin/Addbooks';
import Issued from './components/admin/IssuedBooks';
import Requests from './components/admin/BorrowRequest';
import Staffs from './components/admin/Allstaffs';
import Students from './components/admin/Allstudent';
import ReturnedBooks from './components/Returnedbooks';
import PrivateRoute from './components/PrivateRoute';
import Notifications from './components/Notification'; 

const handleOptionClick = (option) => {
  console.log(option);
};

function App() {
  return (
    <Router>
      <div className="App">
        <AppContent handleOptionClick={handleOptionClick} />
      </div>
    </Router>
  );
}

function AppContent({ handleOptionClick }) {
  const location = useLocation();
  const userType = localStorage.getItem("userType");
  const excludeNavbarPaths = [
    "/login",
    "/studentregister",
    "/staffregister",
    "/adminregister",
    "/adminhome",
    "/books",
    "/addbooks",
    "/issuedbooks",
    "/borrowrequest",
    "/staffs",
    "/students"
  ];

  return (
    <div>
      {!excludeNavbarPaths.includes(location.pathname) && userType !== "admin" && (
        <Navbar handleOptionClick={handleOptionClick} />
      )}
      <Routes>
        <Route path="/login" element={<Loginpage />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/home" element={<PrivateRoute allowedRoles={['student', 'staff']}><Homepage /></PrivateRoute>} />
        <Route path="/adminhome" element={<PrivateRoute allowedRoles={['admin']}><Adminhomepage /></PrivateRoute>} />
        <Route path="/details/:bookId" element={<PrivateRoute allowedRoles={['student', 'staff']}><BookDetails /></PrivateRoute>} />
        <Route path="/admin/details/:bookId" element={<PrivateRoute allowedRoles={['admin']}><AdminBookDetails /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute allowedRoles={['student', 'staff']}><UserProfile handleOptionClick={handleOptionClick} /></PrivateRoute>} />
        <Route path="/returned" element={<PrivateRoute allowedRoles={['student', 'staff']}><ReturnedBooks handleOptionClick={handleOptionClick} /></PrivateRoute>} />
        <Route path="/borrowed" element={<PrivateRoute allowedRoles={['student', 'staff']}><BorrowedBooks handleOptionClick={handleOptionClick} /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute allowedRoles={['student', 'staff']}><Notifications /></PrivateRoute>} />
        <Route path="/studentregister" element={<Studentregister />} />
        <Route path="/staffregister" element={<Staffregister />} />
        <Route path="/adminregister" element={<Adminregister />} />
        <Route path="/books" element={<PrivateRoute allowedRoles={['admin']}><Books /></PrivateRoute>} />
        <Route path="/addbooks" element={<PrivateRoute allowedRoles={['admin']}><AddBook /></PrivateRoute>} />
        <Route path="/issuedbooks" element={<PrivateRoute allowedRoles={['admin']}><Issued /></PrivateRoute>} />
        <Route path="/borrowrequest" element={<PrivateRoute allowedRoles={['admin']}><Requests /></PrivateRoute>} />
        <Route path="/staffs" element={<PrivateRoute allowedRoles={['admin']}><Staffs /></PrivateRoute>} />
        <Route path="/students" element={<PrivateRoute allowedRoles={['admin']}><Students /></PrivateRoute>} />
      </Routes>
    </div>
  );
}

export default App;
