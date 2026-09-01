import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { getAllRentals, returnRental } from '../api';
import PayNowButton from '../components/PayNowButton';

export default function Bookings() {
  const { user } = useAuth();
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchMyRentals();
  }, [user]);

  const fetchMyRentals = async () => {
    if (!user || user.role === 'ADMIN') return;
    try {
      setLoading(true);
      const allRentals = await getAllRentals();
      // Filter rentals for the current logged-in user
      const myRentals = allRentals.filter(
        (rental: any) => rental?.customer?.email === user.email
      );
      setRentals(myRentals);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch your rentals.');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnCar = async (rentalId: number) => {
    setActionLoading(rentalId);
    try {
      await returnRental(rentalId);
      // Refresh rentals
      await fetchMyRentals();
    } catch (err: any) {
      alert(err?.message || 'Failed to return vehicle. Try again.');
    } finally {
      setActionLoading(null);
    }
  };

  if (user?.role === 'ADMIN') {
    return (
      <div className="section animate-fade-in">
        <div className="container" style={{ maxWidth: '760px' }}>
          <div className="card text-center" style={{ padding: '3rem 2rem' }}>
            <h2>Customer bookings only</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.75rem' }}>
              Administrators manage fleet, rentals, and customers from the management dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section animate-fade-in">
      <div className="container" style={{ maxWidth: '960px' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>My Rental Bookings</h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Track active rentals, payments, booking history, and manage vehicle returns.
          </p>
        </div>

        {loading && (
          <div className="flex-center" style={{ minHeight: '200px' }}>
            <div className="spinner"></div>
          </div>
        )}

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '2rem' }}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {rentals.length === 0 ? (
              <div className="card text-center" style={{ padding: '4rem 2rem' }}>
                <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>📋</span>
                <h3>You have no bookings yet</h3>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                  Explore our car catalog and rent your first vehicle today.
                </p>
              </div>
            ) : (
              <div className="flex-col gap-lg">
                {rentals.map((rental) => (
                  <div key={rental.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                      <div className="flex gap-md" style={{ alignItems: 'center' }}>
                        <span style={{ fontSize: '2.2rem' }}>🚗</span>
                        <div>
                          <h3 style={{ fontSize: '1.15rem' }}>
                            {rental?.car?.brand} {rental?.car?.model}
                          </h3>
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                            Reg: {rental?.car?.registrationNumber}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-md" style={{ alignItems: 'center' }}>
                        <span className={`badge ${rental.status === 'BOOKED' ? 'badge-booked' : 'badge-returned'}`}>
                          {rental.status === 'BOOKED' ? 'Active Booking' : 'Returned'}
                        </span>
                        {rental.paymentStatus === 'PAID' ? (
                          <span className="badge badge-available" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                            PAID ✅
                          </span>
                        ) : (
                          <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                            PAYMENT PENDING ⏳
                          </span>
                        )}
                      </div>
                    </div>

                    <hr className="divider" style={{ margin: '0.5rem 0' }} />

                    {/* Booking Details Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', fontSize: '0.9rem', alignItems: 'center' }}>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Pick Up</span>
                        <strong>{rental.rentalDate}</strong>
                      </div>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Return Plan</span>
                        <strong>{rental.returnDate}</strong>
                      </div>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Amount Invoiced</span>
                        <strong style={{ color: 'var(--color-success)', fontSize: '1.1rem' }}>₹{rental.totalAmount}</strong>
                      </div>

                      <div className="flex" style={{ gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                        {rental.paymentStatus !== 'PAID' && rental.status === 'BOOKED' && (
                          <PayNowButton
                            amount={rental.totalAmount}
                            rentalId={rental.id}
                            customerName={`${rental?.customer?.firstName || user?.firstName || ''} ${rental?.customer?.lastName || user?.lastName || ''}`}
                            customerEmail={rental?.customer?.email || user?.email || ''}
                            customerPhone={rental?.customer?.phoneNumber || ''}
                            onPaymentSuccess={() => fetchMyRentals()}
                          />
                        )}

                        {rental.status === 'BOOKED' && (
                          <button
                            className="btn btn-outline-primary btn-sm"
                            disabled={actionLoading === rental.id}
                            onClick={() => handleReturnCar(rental.id)}
                            style={{ height: '38px', alignSelf: 'center' }}
                          >
                            {actionLoading === rental.id ? 'Returning...' : 'Return Key'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
