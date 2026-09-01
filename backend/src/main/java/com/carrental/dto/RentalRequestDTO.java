package com.carrental.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class RentalRequestDTO {

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotNull(message = "Car ID is required")
    private Long carId;

    @NotNull(message = "Rental date is required")
    private LocalDate rentalDate;

    @NotNull(message = "Return date is required")
    private LocalDate returnDate;

    // No-Argument Constructor
    public RentalRequestDTO() {
    }

    // Parameterized Constructor
    public RentalRequestDTO(Long customerId, Long carId,
                            LocalDate rentalDate, LocalDate returnDate) {
        this.customerId = customerId;
        this.carId = carId;
        this.rentalDate = rentalDate;
        this.returnDate = returnDate;
    }

    // Getters and Setters

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getCarId() {
        return carId;
    }

    public void setCarId(Long carId) {
        this.carId = carId;
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
}