package com.carrental.service;

import com.carrental.config.RazorpayConfig;
import com.carrental.dto.PaymentResponseDTO;
import com.carrental.dto.PaymentVerificationDTO;
import com.carrental.entity.Payment;
import com.carrental.entity.Rental;
import com.carrental.repository.PaymentRepository;
import com.carrental.repository.RentalRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Service
public class PaymentService {

    private final RazorpayClient razorpayClient;
    private final RazorpayConfig razorpayConfig;
    private final PaymentRepository paymentRepository;
    private final RentalRepository rentalRepository;

    public PaymentService(RazorpayClient razorpayClient,
                          RazorpayConfig razorpayConfig,
                          PaymentRepository paymentRepository,
                          RentalRepository rentalRepository) {
        this.razorpayClient = razorpayClient;
        this.razorpayConfig = razorpayConfig;
        this.paymentRepository = paymentRepository;
        this.rentalRepository = rentalRepository;
    }

    public String getKeyId() {
        return razorpayConfig.getKeyId();
    }

    // Backward-compatible createOrder returning orderId string
    public String createOrder(double amount) throws Exception {
        PaymentResponseDTO response = createPaymentOrder(amount, null);
        return response.getOrderId();
    }

    // Full createOrder returning DTO with orderId, keyId, amount, rentalId
    public PaymentResponseDTO createPaymentOrder(double amount, Long rentalId) throws Exception {
        JSONObject orderRequest = new JSONObject();
        // Razorpay accepts amount in paise (1 INR = 100 paise)
        orderRequest.put("amount", (int) Math.round(amount * 100));
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "rcpt_" + (rentalId != null ? rentalId + "_" : "") + System.currentTimeMillis());

        Order order = razorpayClient.orders.create(orderRequest);
        String orderId = order.get("id");

        PaymentResponseDTO dto = new PaymentResponseDTO();
        dto.setOrderId(orderId);
        dto.setKeyId(razorpayConfig.getKeyId());
        dto.setAmount(amount);
        dto.setRentalId(rentalId);
        dto.setCurrency("INR");
        dto.setStatus("CREATED");
        return dto;
    }

    // Payment verification with HMAC-SHA256 signature check & DB update
    public PaymentResponseDTO verifyPayment(PaymentVerificationDTO dto) {
        String secret = razorpayConfig.getKeySecret();
        boolean isValid = verifySignature(dto.getRazorpayOrderId(), dto.getRazorpayPaymentId(), dto.getRazorpaySignature(), secret);

        String status = isValid ? "SUCCESS" : "FAILED";

        // Save Payment record in Database
        Payment payment = new Payment(
                dto.getRentalId(),
                dto.getRazorpayOrderId(),
                dto.getRazorpayPaymentId(),
                dto.getRazorpaySignature(),
                dto.getAmount(),
                "INR",
                status
        );
        Payment savedPayment = paymentRepository.save(payment);

        // Connect & Update Rental Payment Status if valid and rentalId present
        if (isValid && dto.getRentalId() != null) {
            Optional<Rental> optionalRental = rentalRepository.findById(dto.getRentalId());
            if (optionalRental.isPresent()) {
                Rental rental = optionalRental.get();
                rental.setPaymentStatus("PAID");
                rentalRepository.save(rental);
            }
        }

        if (isValid) {
            return new PaymentResponseDTO("SUCCESS", "Payment verified and recorded successfully.", savedPayment.getId());
        } else {
            return new PaymentResponseDTO("FAILED", "Razorpay signature verification failed.", null);
        }
    }

    // HMAC-SHA256 Signature Verification Helper
    private boolean verifySignature(String orderId, String paymentId, String signature, String secret) {
        if (orderId == null || paymentId == null || signature == null || secret == null) {
            return false;
        }
        try {
            String payload = orderId + "|" + paymentId;
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256_HMAC.init(secretKey);
            byte[] hash = sha256_HMAC.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString().equalsIgnoreCase(signature);
        } catch (Exception e) {
            return false;
        }
    }
}