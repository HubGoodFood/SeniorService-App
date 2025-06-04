import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'; // We'll create this for App specific styles

// Placeholder components for different sections
const Dashboard = () => <h2>Dashboard</h2>;
const Clients = () => <h2>Client Information Management</h2>;
const Tasks = () => <h2>Task Scheduling</h2>;
const Dispatch = () => <h2>Driver Dispatch & Execution</h2>;
const Billing = () => <h2>Billing & Reports</h2>;
const Notifications = () => <h2>Notifications</h2>;
const UserProfile = () => <h2>User Profile</h2>;
const Settings = () => <h2>Settings</h2>;

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="sidebar">
          <div className="sidebar-header">
            <h3>Senior Service</h3>
          </div>
          <ul className="nav-list">
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/clients">Clients</Link></li>
            <li><Link to="/tasks">Tasks</Link></li>
            <li><Link to="/dispatch">Dispatch</Link></li>
            <li><Link to="/billing">Billing</Link></li>
            <li><Link to="/notifications">Notifications</Link></li>
            <hr />
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/settings">Settings</Link></li>
          </ul>
        </nav>

        <main className="main-content">
          <header className="main-header">
            <h1>Welcome, [User Name]</h1> {/* Placeholder for dynamic user name */}
            {/* Add other header elements like search bar, user menu here */}
          </header>
          <div className="content-area">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/dispatch" element={<Dispatch />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;