import React, { useState, useEffect } from 'react';
import { getAllCars, registerCar, updateCar, deleteCar, getAllRentals, getAllCustomers } from '../api';
import type { Car } from '../types';
import { useAuth } from '../AuthContext';

// Add newly supported manufacturers here; the API still receives the selected string unchanged.
const VEHICLE_BRANDS = ['Toyota', 'Honda', 'Hyundai', 'Maruti Suzuki', 'Tata', 'Mahindra', 'Kia', 'Volkswagen', 'Skoda', 'BMW', 'Mercedes-Benz', 'Audi', 'Ford', 'Renault', 'Nissan'];
const BRAND_MODELS: Record<string, string[]> = {
  Toyota: ['Glanza', 'Urban Cruiser Hyryder', 'Innova Crysta', 'Fortuner', 'Camry'],
  Honda: ['Amaze', 'City', 'Elevate', 'Civic'],
  Hyundai: ['Grand i10 Nios', 'i20', 'Venue', 'Creta', 'Verna', 'Tucson'],
  'Maruti Suzuki': ['Swift', 'Baleno', 'Dzire', 'Brezza', 'Ertiga', 'Grand Vitara'],
  Tata: ['Tiago', 'Altroz', 'Tigor', 'Nexon', 'Punch', 'Harrier', 'Safari'],
  Mahindra: ['XUV 3XO', 'Thar', 'Scorpio-N', 'XUV700', 'Bolero'],
  Kia: ['Sonet', 'Seltos', 'Carens', 'Carnival', 'EV6'],
  Volkswagen: ['Polo', 'Virtus', 'Taigun', 'Tiguan'],
  Skoda: ['Slavia', 'Kushaq', 'Superb', 'Kodiaq'],
  BMW: ['2 Series', '3 Series', '5 Series', 'X1', 'X3', 'X5'],
  'Mercedes-Benz': ['A-Class', 'C-Class', 'E-Class', 'GLA', 'GLC', 'GLE'],
  Audi: ['A4', 'A6', 'Q3', 'Q5', 'Q7'],
  Ford: ['Figo', 'Aspire', 'EcoSport', 'Endeavour'],
  Renault: ['Kwid', 'Triber', 'Kiger', 'Duster'],
  Nissan: ['Magnite', 'Kicks', 'X-Trail']
};

export default function Admin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'fleet' | 'rentals' | 'customers'>('fleet');
  const [cars, setCars] = useState<Car[]>([]);
  const [rentals, setRentals] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add / Edit Car Form State
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    manufacturingYear: new Date().getFullYear(),
    registrationNumber: '',
    fuelType: 'PETROL',
    transmission: 'MANUAL',
    seatingCapacity: 5,
    pricePerDay: 50,
    status: 'AVAILABLE' as 'AVAILABLE' | 'RENTED',
    imageUrl: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const availableModels = formData.brand ? BRAND_MODELS[formData.brand] || [] : [];
  // Preserve older database values in the edit dropdown even if they are not in the starter catalog.
  const modelOptions = formData.model && !availableModels.includes(formData.model)
    ? [formData.model, ...availableModels]
    : availableModels;

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      if (activeTab === 'fleet') {
        const data = await getAllCars();
        setCars(data);
      } else if (activeTab === 'rentals') {
        const data = await getAllRentals();
        setRentals(data);
      } else if (activeTab === 'customers') {
        const data = await getAllCustomers();
        setCustomers(data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch admin data.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingCar(null);
    setFormData({
      brand: '',
      model: '',
      manufacturingYear: new Date().getFullYear(),
      registrationNumber: '',
      fuelType: 'PETROL',
      transmission: 'MANUAL',
      seatingCapacity: 5,
      pricePerDay: 50,
      status: 'AVAILABLE',
      imageUrl: ''
    });
    setFormError('');
    setShowForm(true);
  };

  const handleOpenEdit = (car: Car) => {
    setEditingCar(car);
    setFormData({
      brand: car.brand,
      model: car.model,
      manufacturingYear: car.manufacturingYear,
      registrationNumber: car.registrationNumber,
      fuelType: car.fuelType,
      transmission: car.transmission,
      seatingCapacity: car.seatingCapacity,
      pricePerDay: car.pricePerDay,
      status: car.status,
      imageUrl: car.imageUrl || ''
    });
    setFormError('');
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    try {
      if (editingCar) {
        await updateCar(editingCar.id, formData);
      } else {
        await registerCar(formData);
      }
      setShowForm(false);
      fetchData();
    } catch (err: any) {
      setFormError(err?.message || 'Failed to save car details.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCar = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;
    try {
      await deleteCar(id);
      fetchData();
    } catch (err: any) {
      alert(err?.message || 'Failed to delete car.');
    }
  };

  if (user?.role !== 'ADMIN') {
    return <div className="section"><div className="container"><div className="alert alert-error">Administrator access is required to manage the fleet.</div></div></div>;
  }

  return (
    <div className="section animate-fade-in">
      <div className="container">
        <div className="admin-hero">
          <div>
            <span className="admin-eyebrow">Operations center</span>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Management Dashboard</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Manage your fleet catalog, monitor transaction receipts, and view active users.
            </p>
          </div>

          {activeTab === 'fleet' && (
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              ➕ Add Vehicle
            </button>
          )}
        </div>

        {/* Tabs Row */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--color-border-subtle)', marginBottom: '2rem' }}>
          <button
            onClick={() => setActiveTab('fleet')}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'fleet' ? 'var(--color-primary-light)' : 'var(--color-text-secondary)',
              borderBottom: activeTab === 'fleet' ? '2px solid var(--color-primary)' : 'none',
              padding: '0.8rem 1rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            🚗 Fleet Inventory
          </button>
          <button
            onClick={() => setActiveTab('rentals')}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'rentals' ? 'var(--color-primary-light)' : 'var(--color-text-secondary)',
              borderBottom: activeTab === 'rentals' ? '2px solid var(--color-primary)' : 'none',
              padding: '0.8rem 1rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            📋 Booking Logs
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'customers' ? 'var(--color-primary-light)' : 'var(--color-text-secondary)',
              borderBottom: activeTab === 'customers' ? '2px solid var(--color-primary)' : 'none',
              padding: '0.8rem 1rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            👥 Customers List
          </button>
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

        {/* Tab Contents */}
        {!loading && !error && (
          <>
            {/* FLEET INVENTORY TAB */}
            {activeTab === 'fleet' && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border-subtle)', color: 'var(--color-text-secondary)' }}>
                      <th style={{ padding: '0.75rem' }}>Vehicle</th>
                      <th style={{ padding: '0.75rem' }}>Reg Number</th>
                      <th style={{ padding: '0.75rem' }}>Specs</th>
                      <th style={{ padding: '0.75rem' }}>Price/Day</th>
                      <th style={{ padding: '0.75rem' }}>Status</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cars.map((car) => (
                      <tr key={car.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <td style={{ padding: '1rem 0.75rem' }}>
                          <strong>{car.brand} {car.model}</strong>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Year: {car.manufacturingYear}</span>
                        </td>
                        <td style={{ padding: '1rem 0.75rem' }}>{car.registrationNumber}</td>
                        <td style={{ padding: '1rem 0.75rem' }}>
                          {car.transmission} | {car.fuelType} | {car.seatingCapacity} Seater
                        </td>
                        <td style={{ padding: '1rem 0.75rem', fontWeight: 600 }}>₹{car.pricePerDay}</td>
                        <td style={{ padding: '1rem 0.75rem' }}>
                          <span className={`badge ${car.status === 'AVAILABLE' ? 'badge-available' : 'badge-rented'}`}>
                            {car.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => handleOpenEdit(car)} style={{ marginRight: '0.5rem' }}>
                            Edit
                          </button>
                          <button className="btn btn-outline-primary btn-sm btn-accent" onClick={() => handleDeleteCar(car.id)} style={{ color: 'var(--color-accent)' }}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* BOOKING LOGS TAB */}
            {activeTab === 'rentals' && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border-subtle)', color: 'var(--color-text-secondary)' }}>
                      <th style={{ padding: '0.75rem' }}>ID</th>
                      <th style={{ padding: '0.75rem' }}>Customer</th>
                      <th style={{ padding: '0.75rem' }}>Vehicle</th>
                      <th style={{ padding: '0.75rem' }}>Rental Dates</th>
                      <th style={{ padding: '0.75rem' }}>Invoiced</th>
                      <th style={{ padding: '0.75rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rentals.map((rental) => (
                      <tr key={rental.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <td style={{ padding: '1rem 0.75rem' }}>#{rental.id}</td>
                        <td style={{ padding: '1rem 0.75rem' }}>
                          <strong>{rental?.customer?.firstName} {rental?.customer?.lastName}</strong>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{rental?.customer?.email}</span>
                        </td>
                        <td style={{ padding: '1rem 0.75rem' }}>
                          {rental?.car?.brand} {rental?.car?.model}
                        </td>
                        <td style={{ padding: '1rem 0.75rem' }}>
                          {rental.rentalDate} to {rental.returnDate}
                        </td>
                        <td style={{ padding: '1rem 0.75rem', fontWeight: 600, color: 'var(--color-success)' }}>
                          ₹{rental.totalAmount}
                        </td>
                        <td style={{ padding: '1rem 0.75rem' }}>
                          <span className={`badge ${rental.status === 'BOOKED' ? 'badge-booked' : 'badge-returned'}`}>
                            {rental.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* CUSTOMERS LIST TAB */}
            {activeTab === 'customers' && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border-subtle)', color: 'var(--color-text-secondary)' }}>
                      <th style={{ padding: '0.75rem' }}>ID</th>
                      <th style={{ padding: '0.75rem' }}>Name</th>
                      <th style={{ padding: '0.75rem' }}>Email</th>
                      <th style={{ padding: '0.75rem' }}>Phone</th>
                      <th style={{ padding: '0.75rem' }}>DL Number</th>
                      <th style={{ padding: '0.75rem' }}>Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c) => (
                      <tr key={c.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <td style={{ padding: '1rem 0.75rem' }}>#{c.id}</td>
                        <td style={{ padding: '1rem 0.75rem' }}><strong>{c.firstName} {c.lastName}</strong></td>
                        <td style={{ padding: '1rem 0.75rem' }}>{c.email}</td>
                        <td style={{ padding: '1rem 0.75rem' }}>{c.phoneNumber}</td>
                        <td style={{ padding: '1rem 0.75rem' }}>{c.drivingLicenseNumber}</td>
                        <td style={{ padding: '1rem 0.75rem' }}>{c.address}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add / Edit Form Modal */}
      {showForm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="card card-glass animate-scale-in" style={{ width: '100%', maxWidth: '560px', padding: '2rem' }}>
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
              <h2>{editingCar ? 'Edit Vehicle Info' : 'Register New Vehicle'}</h2>
              <button
                onClick={() => setShowForm(false)}
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            {formError && (
              <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="flex-col gap-md">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <select
                    required
                    className="form-input form-select"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value, model: '' })}
                  >
                    <option value="" disabled>Select a brand</option>
                    {VEHICLE_BRANDS.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Model</label>
                  <select
                    required
                    disabled={!formData.brand}
                    className="form-input form-select"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  >
                    <option value="" disabled>{formData.brand ? 'Select a model' : 'Select brand first'}</option>
                    {modelOptions.map((model) => <option key={model} value={model}>{model}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Manufacturing Year</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    value={formData.manufacturingYear}
                    onChange={(e) => setFormData({ ...formData, manufacturingYear: parseInt(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Registration Number</label>
                  <input
                    type="text"
                    required
                    placeholder="MH-12-XX-XXXX"
                    className="form-input"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Transmission</label>
                  <select
                    className="form-input form-select"
                    value={formData.transmission}
                    onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                  >
                    <option value="MANUAL">Manual</option>
                    <option value="AUTOMATIC">Automatic</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Fuel Type</label>
                  <select
                    className="form-input form-select"
                    value={formData.fuelType}
                    onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                  >
                    <option value="PETROL">Petrol</option>
                    <option value="DIESEL">Diesel</option>
                    <option value="CNG">CNG</option>
                    <option value="ELECTRIC">Electric</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Seating</label>
                  <input
                    type="number"
                    required
                    min={1}
                    className="form-input"
                    value={formData.seatingCapacity}
                    onChange={(e) => setFormData({ ...formData, seatingCapacity: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Image URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://example.com/car.jpg"
                    className="form-input"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Price per Day</label>
                  <input
                    type="number"
                    required
                    min={1}
                    className="form-input"
                    value={formData.pricePerDay}
                    onChange={(e) => setFormData({ ...formData, pricePerDay: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div className="flex gap-md" style={{ marginTop: '1rem' }}>
                <button type="button" className="btn btn-ghost btn-full" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-full" disabled={formLoading}>
                  {formLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
