import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            
            <NavLink className="navbar-icon">
                <img 
                    src= {require("../media/LOGO_WHITE.png")}
                    width={172}
                    height={65}
                />
            </NavLink>
            
            <div className="container" >
                {/* <NavLink className="navbar-brand" to="/">HR Portal</NavLink> */}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">Increment Letters</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/create">Create New</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/import">Import CSV/Excel</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
            <ul className="navbar-nav">
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                        <i className="bi bi-person-circle me-1"></i>
                        {user?.email || 'User'}
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                            <NavLink className="dropdown-item" to="/profile">
                                <i className="bi bi-person me-2"></i>Profile
                            </NavLink>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                            <button className="dropdown-item text-danger" onClick={handleLogout}>
                                <i className="bi bi-box-arrow-right me-2"></i>Logout
                            </button>
                        </li>
                    </ul>
                </li>
            </ul>  
        </nav>
    );
}

export default Navbar;