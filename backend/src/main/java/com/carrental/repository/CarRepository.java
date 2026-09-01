package com.carrental.repository;

import com.carrental.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CarRepository extends JpaRepository<Car, Long> {



    List<Car> findByBrand(String brand);

    List<Car> findByModel(String model);

    List<Car> findByFuelType(String fuelType);

    List<Car> findByTransmission(String transmission);

    List<Car> findByStatus(String status);

    boolean existsByRegistrationNumber(String registrationNumber);


}