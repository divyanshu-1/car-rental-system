package com.carrental.dto;

import java.time.LocalDate;

public class RentalResponseDTO {

    private Long id;

    private String customerName;

    private String customerEmail;

    private String customerPhone;

    private String carBrand;

    private String carModel;

    private String registrationNumber;

    private LocalDate rentalDate;

    private LocalDate returnDate;

    private Double totalAmount;

    private String status;

    // No-Argument Constructor
    public RentalResponseDTO() {
    }

    // Parameterized Constructor
    public RentalResponseDTO(Long id, String customerName, String customerEmail,
                             String customerPhone, String carBrand,
                             String carModel, String registrationNumber,
                             LocalDate rentalDate, LocalDate returnDate,
                             Double totalAmount, String status) {
        this.id = id;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.customerPhone = customerPhone;
        this.carBrand = carBrand;
        this.carModel = carModel;
        this.registrationNumber = registrationNumber;
        this.rentalDate = rentalDate;
        this.returnDate = returnDate;
        this.totalAmount = totalAmount;
        this.status = status;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getCarBrand() {
        return carBrand;
    }

    public void setCarBrand(String carBrand) {
        this.carBrand = carBrand;
    }

    public String getCarModel() {
        return carModel;
    }

    public void setCarModel(String carModel) {
        this.carModel = carModel;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public LocalDate getRentalDate() {
        return rentalDate;
    }

    public void setRentalDate(LocalDate rentalDate) {
        this.rentalDate = rentalDate;
    }

    public LocalDate getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(LocalDate returnDate) {
        this.returnDate = returnDate;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}