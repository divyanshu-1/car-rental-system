import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { getAllCars, createRental } from '../api';
import type { Car, Rental } from '../types';
import PayNowButton from '../components/PayNowButton';

interface FleetProps {
  onNavigate: (page: string) => void;
}

export default function Fleet({ onNavigate }: FleetProps) {
  const { isLoggedIn, user } = useAuth();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedTransmission, setSelectedTransmission] = useState('All');
  const [selectedFuel, setSelectedFuel] = useState('All');

  // Booking Modal State
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [createdRental, setCreatedRental] = useState<Rental | null>(null);
  const [rentalDate, setRentalDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const data = await getAllCars();
      setCars(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load cars. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const brands = ['All', ...Array.from(new Set(cars.map((car) => car.brand)))];

  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.brand.toLowerCase().includes(search.toLowerCase()) ||
      car.model.toLowerCase().includes(search.toLowerCase());
    const matchesBrand = selectedBrand === 'All' || car.brand === selectedBrand;
    const matchesTransmission = selectedTransmission === 'All' || car.transmission === selectedTransmission;
    const matchesFuel = selectedFuel === 'All' || car.fuelType === selectedFuel;
    return matchesSearch && matchesBrand && matchesTransmission && matchesFuel;
  });

  const handleOpenBooking = (car: Car) => {
    if (!isLoggedIn) {
      onNavigate('login');
      return;
    }
    if (user?.role === 'ADMIN') {
      setBookingError('Administrator accounts manage the fleet and cannot create rentals.');
      return;
    }
    setSelectedCar(car);
    setCreatedRental(null);
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    setRentalDate(today);
    setReturnDate(tomorrow);
    setBookingError('');
    setBookingSuccess(false);
  };

  const calculateTotal = () => {
    if (!selectedCar || !rentalDate || !returnDate) return 0;
    const d1 = new Date(rentalDate);
    const d2 = new Date(returnDate);
    const diffTime = d2.getTime() - d1.getTime();
    if (diffTime < 0) return 0;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const days = diffDays === 0 ? 1 : diffDays;
    return days * selectedCar.pricePerDay;
  };

  const handleConfirmBooking = async () => {
    if (!selectedCar || !user) return;
    setBookingLoading(true);
    setBookingError('');
    try {
      const newRental = await createRental({
        customerId: user.id,
        carId: selectedCar.id,
        rentalDate,
        returnDate,
      });
      setCreatedRental(newRental);
      setBookingSuccess(true);
      fetchCars(); // Refresh fleet availability
    } catch (err: any) {
      setBookingError(err?.message || 'Booking failed. Try different dates or vehicle.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="section animate-fade-in">
      <div className="container">
        {/* Hero Banner */}
        <div className="text-center" style={{ marginBottom: '3.5rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 800 }}>
            Find Your <span className="text-gradient">Perfect Drive</span>
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem' }}>
            Choose from our premium selection of verified cars, fully sanitized and ready for your next adventure.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="card card-glass" style={{ padding: '1.5rem', marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Search Model</label>
              <input
                type="text"
                placeholder="e.g. Civic, Model 3..."
                className="form-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Brand</label>
              <select className="form-input" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Transmission</label>
              <select className="form-input" value={selectedTransmission} onChange={(e) => setSelectedTransmission(e.target.value)}>
                <option value="All">All Types</option>
                <option value="MANUAL">Manual</option>
                <option value="AUTOMATIC">Automatic</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Fuel Type</label>
              <select className="form-input" value={selectedFuel} onChange={(e) => setSelectedFuel(e.target.value)}>
                <option value="All">All Fuels</option>
                <option value="PETROL">Petrol</option>
                <option value="DIESEL">Diesel</option>
                <option value="CNG">CNG</option>
                <option value="ELECTRIC">Electric</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="flex-center" style={{ minHeight: '300px' }}>
            <div className="spinner"></div>
          </div>
        )}

        {error && (
          <div className="alert alert-error text-center" style={{ margin: '2rem 0' }}>
            {error}
          </div>
        )}

        {/* Catalog Grid */}
        {!loading && !error && (
          <>
            {filteredCars.length === 0 ? (
              <div className="text-center" style={{ padding: '4rem 0', color: 'var(--color-text-secondary)' }}>
                <h3>No vehicles found matching filters</h3>
                <p>Try resetting search text or categories.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {filteredCars.map((car) => (
                  <div key={car.id} className="card flex-col" style={{ minHeight: '430px' }}>
                    <div style={{ height: '200px', background: 'rgba(255,255,255,0.03)', position: 'relative', overflow: 'hidden' }}>
                      {car.imageUrl ? (
                        <img src={car.imageUrl} alt={`${car.brand} ${car.model}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div className="flex-center" style={{ height: '100%', color: 'var(--color-text-muted)', fontSize: '4rem' }}>
                          🚗
                        </div>
                      )}
                      <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
                        <span className={`badge ${car.status === 'AVAILABLE' ? 'badge-available' : 'badge-rented'}`}>
                          {car.status === 'AVAILABLE' ? 'Available' : 'Rented'}
                        </span>
                      </div>
                    </div>

                    <div className="flex-col" style={{ padding: '1.5rem', flexGrow: 1 }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-primary-light)', fontWeight: 600, textTransform: 'uppercase' }}>
                        {car.brand}
                      </span>
                      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.8rem' }}>{car.model}</h3>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                        <div>⚙️ {car.transmission}</div>
                        <div>⛽ {car.fuelType}</div>
                        <div>👥 {car.seatingCapacity} Seats</div>
                        <div>📅 {car.manufacturingYear}</div>
                      </div>

                      <div className="flex-between" style={{ marginTop: 'auto' }}>
                        <div>
                          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>₹{car.pricePerDay}</span>
                          <span style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}> / day</span>
                        </div>
                        <button
                          className={`btn ${car.status === 'AVAILABLE' ? 'btn-primary' : 'btn-ghost'}`}
                          disabled={car.status !== 'AVAILABLE'}
                          onClick={() => handleOpenBooking(car)}
                        >
                          {car.status === 'AVAILABLE' ? 'Rent Vehicle' : 'Unavailable'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Booking Modal */}
      {selectedCar && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '520px', padding: '2rem' }}>
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem' }}>Rent {selectedCar.brand} {selectedCar.model}</h2>
              <button
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}
                onClick={() => setSelectedCar(null)}
              >
                ✕
              </button>
            </div>

            {bookingError && (
              <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                {bookingError}
              </div>
            )}

            {bookingSuccess && createdRental ? (
              <div className="text-center flex-col gap-md" style={{ padding: '1rem 0' }}>
                <span style={{ fontSize: '3rem' }}>🎉</span>
                <h3 style={{ color: 'var(--color-success)' }}>Rental Booking Created!</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                  Booking #{createdRental.id} confirmed. Complete payment below using Razorpay Test Mode.
                </p>

                <div style={{ marginTop: '1rem' }}>
                  <PayNowButton
                    amount={createdRental.totalAmount}
                    rentalId={createdRental.id}
                    customerName={`${user?.firstName || ''} ${user?.lastName || ''}`}
                    customerEmail={user?.email || ''}
                    onPaymentSuccess={() => {
                      setTimeout(() => {
                        setSelectedCar(null);
                        onNavigate('bookings');
                      }, 1500);
                    }}
                  />
                </div>

                <button
                  className="btn btn-ghost btn-sm"
                  style={{ marginTop: '1rem' }}
                  onClick={() => {
                    setSelectedCar(null);
                    onNavigate('bookings');
                  }}
                >
                  Go to My Bookings
                </button>
              </div>
            ) : (
              <>
                <div className="flex-col gap-md" style={{ marginBottom: '1.5rem' }}>
                  <div className="flex gap-md" style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: '2.5rem' }}>🚗</span>
                    <div>
                      <h3 style={{ fontSize: '1.1rem' }}>{selectedCar.brand} {selectedCar.model}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                        Daily Rate: ₹{selectedCar.pricePerDay} | Transmission: {selectedCar.transmission}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Rental Date</label>
                      <input
                        type="date"
                        required
                        className="form-input"
                        value={rentalDate}
                        onChange={(e) => setRentalDate(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Return Date</label>
                      <input
                        type="date"
                        required
                        className="form-input"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex-between" style={{ padding: '1rem 0', borderTop: '1px solid var(--color-border-subtle)' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Estimated Total</span>
                    <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-success)' }}>
                      ₹{calculateTotal()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-md">
                  <button className="btn btn-ghost btn-full" onClick={() => setSelectedCar(null)}>
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary btn-full"
                    disabled={bookingLoading || calculateTotal() <= 0}
                    onClick={handleConfirmBooking}
                  >
                    {bookingLoading ? 'Creating Booking...' : 'Proceed to Rent'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
