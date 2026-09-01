import { useState } from 'react';
import { AuthProvider } from './AuthContext';
import Navbar from './components/Navbar';
import Fleet from './pages/Fleet';
import Login from './pages/Login';
import Register from './pages/Register';
import Bookings from './pages/Bookings';
import Admin from './pages/Admin';

export default function App() {
  const [currentPage, setCurrentPage] = useState('fleet');

  const renderPage = () => {
    switch (currentPage) {
      case 'fleet':
        return <Fleet onNavigate={setCurrentPage} />;
      case 'login':
        return <Login onNavigate={setCurrentPage} />;
      case 'register':
        return <Register onNavigate={setCurrentPage} />;
      case 'bookings':
        return <Bookings />;
      case 'admin':
        return <Admin />;
      default:
        return <Fleet onNavigate={setCurrentPage} />;
    }
  };

  return (
    <AuthProvider>
      <div className="flex-col" style={{ minHeight: '100vh' }}>
        <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
        <main style={{ flexGrow: 1 }}>
          {renderPage()}
        </main>
        <footer style={{
          textAlign: 'center',
          padding: '2rem 0',
          borderTop: '1px solid var(--color-border-subtle)',
          color: 'var(--color-text-muted)',
          fontSize: '0.85rem'
        }}>
          &copy; {new Date().getFullYear()} DriveEasy Rentals. All rights reserved.
        </footer>
      </div>
    </AuthProvider>
  );
}
