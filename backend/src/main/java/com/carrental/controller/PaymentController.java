package com.carrental.controller;

import com.carrental.dto.PaymentResponseDTO;
import com.carrental.dto.PaymentVerificationDTO;
import com.carrental.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // Get public Razorpay Key ID
    @GetMapping("/key")
    public ResponseEntity<Map<String, String>> getKey() {
        return ResponseEntity.ok(Map.of("keyId", paymentService.getKeyId()));
    }

    // Create Razorpay Order
    // Supports query params: amount and optional rentalId
    @PostMapping("/create-order")
    public ResponseEntity<PaymentResponseDTO> createOrder(
            @RequestParam double amount,
            @RequestParam(required = false) Long rentalId) throws Exception {

        PaymentResponseDTO response = paymentService.createPaymentOrder(amount, rentalId);
        return ResponseEntity.ok(response);
    }

    // Verify Razorpay Payment Signature & Record Transaction
    @PostMapping("/verify")
    public ResponseEntity<PaymentResponseDTO> verifyPayment(@RequestBody PaymentVerificationDTO verificationDTO) {
        PaymentResponseDTO response = paymentService.verifyPayment(verificationDTO);
        if ("SUCCESS".equals(response.getStatus())) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}