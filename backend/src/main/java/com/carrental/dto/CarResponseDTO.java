package com.carrental.dto;

public class CarResponseDTO {

    private Long id;

    private String brand;

    private String model;

    private Integer manufacturingYear;

    private String registrationNumber;

    private String fuelType;

    private String transmission;

    private Integer seatingCapacity;

    private Double pricePerDay;

    private String status;

    private String imageUrl;

    // No-Argument Constructor
    public CarResponseDTO() {
    }

    // All-Arguments Constructor
    public CarResponseDTO(Long id, String brand, String model,
                          Integer manufacturingYear,
                          String registrationNumber,
                          String fuelType,
                          String transmission,
                          Integer seatingCapacity,
                          Double pricePerDay,
                          String status,
                          String imageUrl) {
        this.id = id;
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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