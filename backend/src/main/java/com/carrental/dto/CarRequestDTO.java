package com.carrental.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class CarRequestDTO {

    @NotBlank(message = "Brand is required")
    private String brand;

    @NotBlank(message = "Model is required")
    private String model;

    @NotNull(message = "Manufacturing year is required")
    @Positive(message = "Manufacturing year must be positive")
    private Integer manufacturingYear;

    @NotBlank(message = "Registration number is required")
    private String registrationNumber;

    @NotBlank(message = "Fuel type is required")
    private String fuelType;

    @NotBlank(message = "Transmission is required")
    private String transmission;

    @NotNull(message = "Seating capacity is required")
    @Positive(message = "Seating capacity must be greater than 0")
    private Integer seatingCapacity;

    @NotNull(message = "Price per day is required")
    @Positive(message = "Price must be greater than 0")
    private Double pricePerDay;

    @NotBlank(message = "Status is required")
    private String status;

    private String imageUrl;

    // No-Argument Constructor
    public CarRequestDTO() {
    }

    // All-Arguments Constructor
    public CarRequestDTO(String brand, String model, Integer manufacturingYear,
                         String registrationNumber, String fuelType,
                         String transmission, Integer seatingCapacity,
                         Double pricePerDay, String status, String imageUrl) {
        this.brand = brand;
        this.model = model;
        this.manufacturingYear = manufacturingYear;
        this.registrationNumber = registrationNumber;
        this.fuelType = fuelType;
        this.transmission = transmission;
        this.seatingCapacity = seatingCapacity;
        this.pricePerDay = pricePerDay;
        this.status = status;
        this.imageUrl = imageUrl;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Integer getManufacturingYear() {
        return manufacturingYear;
    }

    public void setManufacturingYear(Integer manufacturingYear) {
        this.manufacturingYear = manufacturingYear;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getFuelType() {
        return fuelType;
    }

    public void setFuelType(String fuelType) {
        this.fuelType = fuelType;
    }

    public String getTransmission() {
        return transmission;
    }

    public void setTransmission(String transmission) {
        this.transmission = transmission;
    }

    public Integer getSeatingCapacity() {
        return seatingCapacity;
    }

    public void setSeatingCapacity(Integer seatingCapacity) {
        this.seatingCapacity = seatingCapacity;
    }

    public Double getPricePerDay() {
        return pricePerDay;
    }

    public void setPricePerDay(Double pricePerDay) {
        this.pricePerDay = pricePerDay;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}