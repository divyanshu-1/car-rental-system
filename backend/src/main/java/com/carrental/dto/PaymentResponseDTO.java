package com.carrental.dto;

public class PaymentResponseDTO {

    private String orderId;
    private String keyId;
    private Long rentalId;
    private Double amount;
    private String currency = "INR";
    private String status;
    private String message;
    private Long paymentId;

    public PaymentResponseDTO() {
    }

    public PaymentResponseDTO(String orderId, String keyId, Long rentalId, Double amount) {
        this.orderId = orderId;
        this.keyId = keyId;
        this.rentalId = rentalId;
        this.amount = amount;
        this.currency = "INR";
        this.status = "CREATED";
    }

    public PaymentResponseDTO(String status, String message, Long paymentId) {
        this.status = status;
        this.message = message;
        this.paymentId = paymentId;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getKeyId() {
        return keyId;
    }

    public void setKeyId(String keyId) {
        this.keyId = keyId;
    }

    public Long getRentalId() {
        return rentalId;
    }

    public void setRentalId(Long rentalId) {
        this.rentalId = rentalId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }
}