// ==========================================
// API Service Layer
// ==========================================
import type {
  Car,
  Customer,
  Rental,
  LoginResponse,
  RegisterRequest,
  RentalRequest,
  PaymentOrderResponse,
  PaymentVerificationRequest,
  PaymentVerificationResponse
} from './types';

const BASE_URL = 'http://localhost:8080/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('jwt_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
    throw errorBody;
  }
  // Handle empty body (e.g. DELETE 200 with no content)
  const text = await res.text();
  return text ? JSON.parse(text) : (undefined as T);
}

// ======== AUTH ========
export async function loginCustomer(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/customers/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<LoginResponse>(res);
}

export async function registerCustomer(data: RegisterRequest): Promise<Customer> {
  const res = await fetch(`${BASE_URL}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Customer>(res);
}

// ======== CARS ========
export async function getAllCars(): Promise<Car[]> {
  const res = await fetch(`${BASE_URL}/cars`, { headers: getAuthHeaders() });
  return handleResponse<Car[]>(res);
}

export async function getAvailableCars(): Promise<Car[]> {
  const res = await fetch(`${BASE_URL}/cars/status/AVAILABLE`, { headers: getAuthHeaders() });
  return handleResponse<Car[]>(res);
}

export async function getCarsByBrand(brand: string): Promise<Car[]> {
  const res = await fetch(`${BASE_URL}/cars/brand/${encodeURIComponent(brand)}`, { headers: getAuthHeaders() });
  return handleResponse<Car[]>(res);
}

export async function getCarsByFuelType(fuelType: string): Promise<Car[]> {
  const res = await fetch(`${BASE_URL}/cars/fuel/${encodeURIComponent(fuelType)}`, { headers: getAuthHeaders() });
  return handleResponse<Car[]>(res);
}

export async function getCarsByTransmission(transmission: string): Promise<Car[]> {
  const res = await fetch(`${BASE_URL}/cars/transmission/${encodeURIComponent(transmission)}`, { headers: getAuthHeaders() });
  return handleResponse<Car[]>(res);
}

export async function registerCar(data: Omit<Car, 'id'>): Promise<Car> {
  const res = await fetch(`${BASE_URL}/cars`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Car>(res);
}

export async function updateCar(id: number, data: Omit<Car, 'id'>): Promise<Car> {
  const res = await fetch(`${BASE_URL}/cars/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Car>(res);
}

export async function deleteCar(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/cars/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse<void>(res);
}

// ======== RENTALS ========
export async function createRental(data: RentalRequest): Promise<Rental> {
  const res = await fetch(`${BASE_URL}/rentals`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Rental>(res);
}

export async function getAllRentals(): Promise<Rental[]> {
  const res = await fetch(`${BASE_URL}/rentals`, { headers: getAuthHeaders() });
  return handleResponse<Rental[]>(res);
}

export async function returnRental(id: number): Promise<Rental> {
  const res = await fetch(`${BASE_URL}/rentals/${id}/return`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });
  return handleResponse<Rental>(res);
}

export async function deleteRental(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/rentals/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse<void>(res);
}

// ======== CUSTOMERS ========
export async function getAllCustomers(): Promise<Customer[]> {
  const res = await fetch(`${BASE_URL}/customers`, { headers: getAuthHeaders() });
  return handleResponse<Customer[]>(res);
}

// ======== PAYMENTS ========
export async function getRazorpayKey(): Promise<{ keyId: string }> {
  const res = await fetch(`${BASE_URL}/payments/key`, { headers: getAuthHeaders() });
  return handleResponse<{ keyId: string }>(res);
}

export async function createPaymentOrder(amount: number, rentalId?: number): Promise<PaymentOrderResponse> {
  const queryParams = new URLSearchParams({ amount: amount.toString() });
  if (rentalId) {
    queryParams.append('rentalId', rentalId.toString());
  }
  const res = await fetch(`${BASE_URL}/payments/create-order?${queryParams.toString()}`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return handleResponse<PaymentOrderResponse>(res);
}

export async function verifyPayment(data: PaymentVerificationRequest): Promise<PaymentVerificationResponse> {
  const res = await fetch(`${BASE_URL}/payments/verify`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<PaymentVerificationResponse>(res);
}
