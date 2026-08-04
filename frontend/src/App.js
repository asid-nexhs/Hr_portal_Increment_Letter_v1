import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import LetterList from './components/LetterList';
import LetterForm from './components/LetterForm';
import ImportCSV from './components/ImportCSV';
import Profile from './components/Profile';
import UserList from './components/UserList';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <div className="container mt-4">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <PrivateRoute>
                  <LetterList />
                </PrivateRoute>
              } />
              <Route path="/create" element={
                <PrivateRoute>
                  <LetterForm />
                </PrivateRoute>
              } />
              <Route path="/edit/:id" element={
                <PrivateRoute>
                  <LetterForm />
                </PrivateRoute>
              } />
              <Route path="/import" element={
                <PrivateRoute>
                  <ImportCSV />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="/users" element={
                <PrivateRoute>
                  <UserList />
                </PrivateRoute>
              } />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;