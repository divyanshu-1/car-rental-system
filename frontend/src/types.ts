// ==========================================
// Shared TypeScript Types & Interfaces
// ==========================================

export interface Car {
  id: number;
  brand: string;
  model: string;
  manufacturingYear: number;
  registrationNumber: string;
  fuelType: string;
  transmission: string;
  seatingCapacity: number;
  pricePerDay: number;
  status: 'AVAILABLE' | 'RENTED';
  imageUrl?: string;
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  role?: 'USER' | 'ADMIN';
}

export interface Rental {
  id: number;
  customer?: Customer;
  car?: Car;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  carBrand?: string;
  carModel?: string;
  registrationNumber?: string;
  rentalDate: string;
  returnDate: string;
  totalAmount: number;
  status: 'BOOKED' | 'RETURNED';
  paymentStatus?: 'PENDING' | 'PAID' | 'FAILED';
}

export interface LoginResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  role?: 'USER' | 'ADMIN';
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  address: string;
  drivingLicenseNumber: string;
  role?: 'USER' | 'ADMIN';
}

export interface RentalRequest {
  customerId: number;
  carId: number;
  rentalDate: string;
  returnDate: string;
}

export interface ApiError {
  message?: string;
  [key: string]: string | undefined;
}

// ======== RAZORPAY & PAYMENT TYPES ========

export interface PaymentOrderResponse {
  orderId: string;
  keyId: string;
  amount: number;
  currency: string;
  rentalId?: number;
  status?: string;
}

export interface PaymentVerificationRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  rentalId?: number;
  amount?: number;
}

export interface PaymentVerificationResponse {
  status: 'SUCCESS' | 'FAILED';
  message: string;
  paymentId?: number;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: string, callback: (response: any) => void) => void;
    };
  }
}
