import { useState } from 'react';
import { useAuth } from '../AuthContext';
import './Navbar.css';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { user, logout, isLoggedIn } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    onNavigate('fleet');
    setMenuOpen(false);
  };

  const nav = (page: string) => {
    onNavigate(page);
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <button className="navbar-logo" onClick={() => nav('fleet')}>
          <span className="logo-icon">🚗</span>
          <span className="logo-text">Drive<span className="text-gradient">Easy</span></span>
        </button>

        {/* Desktop Nav */}
        <nav className="navbar-links hide-mobile">
          <button className={`nav-link ${currentPage === 'fleet' ? 'active' : ''}`} onClick={() => nav('fleet')}>Fleet</button>
          {isLoggedIn && (
            <>
              {user?.role !== 'ADMIN' && <button className={`nav-link ${currentPage === 'bookings' ? 'active' : ''}`} onClick={() => nav('bookings')}>My Bookings</button>}
              {user?.role === 'ADMIN' && (
                <button className={`nav-link ${currentPage === 'admin' ? 'active' : ''}`} onClick={() => nav('admin')}>Admin</button>
              )}
            </>
          )}
        </nav>

        {/* Auth Buttons */}
        <div className="navbar-auth hide-mobile">
          {isLoggedIn ? (
            <div className="user-menu">
              <span className="user-greeting">
                Hi, {user?.firstName} {user?.role === 'ADMIN' ? '🛡️ (Admin)' : '👋'}
              </span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="flex gap-sm">
              <button className="btn btn-ghost btn-sm" onClick={() => nav('login')}>Sign In</button>
              <button className="btn btn-primary btn-sm" onClick={() => nav('register')}>Join Free</button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className={`ham-line ${menuOpen ? 'open' : ''}`}></span>
          <span className={`ham-line ${menuOpen ? 'open' : ''}`}></span>
          <span className={`ham-line ${menuOpen ? 'open' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="mobile-menu animate-fade-up">
          <button className="mobile-nav-link" onClick={() => nav('fleet')}>🚗 Fleet</button>
          {isLoggedIn ? (
            <>
              {user?.role !== 'ADMIN' && <button className="mobile-nav-link" onClick={() => nav('bookings')}>📋 My Bookings</button>}
              {user?.role === 'ADMIN' && (
                <button className="mobile-nav-link" onClick={() => nav('admin')}>⚙️ Admin Dashboard</button>
              )}
              <hr className="divider" />
              <button className="mobile-nav-link danger" onClick={handleLogout}>🚪 Logout</button>
            </>
          ) : (
            <>
              <button className="mobile-nav-link" onClick={() => nav('login')}>Sign In</button>
              <button className="mobile-nav-link accent" onClick={() => nav('register')}>Join Free</button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
