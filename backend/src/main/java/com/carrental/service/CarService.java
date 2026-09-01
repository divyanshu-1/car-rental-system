package com.carrental.service;


import com.carrental.dto.CarRequestDTO;
import com.carrental.dto.CarResponseDTO;
import com.carrental.entity.Car;
import com.carrental.repository.CarRepository;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Service
public class CarService {


    private final CarRepository carRepository;


    public CarService(CarRepository carRepository) {

        this.carRepository = carRepository;
    }



    // Register a New Car

    // Register a New Car

    public CarResponseDTO registerCar(CarRequestDTO requestDTO) {

        // Check Duplicate Registration Number
        if (carRepository.existsByRegistrationNumber(requestDTO.getRegistrationNumber())) {
            throw new RuntimeException("Registration Number already exists");
        }

        Car car = new Car();

        car.setBrand(requestDTO.getBrand());
        car.setModel(requestDTO.getModel());
        car.setManufacturingYear(requestDTO.getManufacturingYear());
        car.setRegistrationNumber(requestDTO.getRegistrationNumber());
        car.setFuelType(requestDTO.getFuelType());
        car.setTransmission(requestDTO.getTransmission());
        car.setSeatingCapacity(requestDTO.getSeatingCapacity());
        car.setPricePerDay(requestDTO.getPricePerDay());
        car.setImageUrl(requestDTO.getImageUrl());

        // Default Status
        car.setStatus("AVAILABLE");

        Car savedCar = carRepository.save(car);

        return convertToDTO(savedCar);
    }





    // Get All Cars

    public List<CarResponseDTO> getAllCars() {


        List<Car> cars = carRepository.findAll();


        List<CarResponseDTO> responseList =
                new ArrayList<>();


        for(Car car : cars){

            responseList.add(
                    convertToDTO(car)
            );
        }


        return responseList;

    }
    public Page<CarResponseDTO> getCarsWithPagination(int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        Page<Car> carPage = carRepository.findAll(pageable);

        return carPage.map(this::convertToDTO);
    }




    // Get Available Cars Only

    public List<CarResponseDTO> getAvailableCars(){


        List<Car> cars =
                carRepository.findByStatus("AVAILABLE");


        List<CarResponseDTO> responseList =
                new ArrayList<>();


        for(Car car : cars){

            responseList.add(
                    convertToDTO(car)
            );

        }


        return responseList;
    }





    // Get Car By ID

    public CarResponseDTO getCarById(Long id) {

        Car car = carRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Car not found"));

        return convertToDTO(car);
    }





    // Update Car

    public CarResponseDTO updateCar(Long id,
                                    CarRequestDTO requestDTO) {

        Car car = carRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Car not found"));

        car.setBrand(requestDTO.getBrand());
        car.setModel(requestDTO.getModel());
        car.setManufacturingYear(requestDTO.getManufacturingYear());
        car.setRegistrationNumber(requestDTO.getRegistrationNumber());
        car.setFuelType(requestDTO.getFuelType());
        car.setTransmission(requestDTO.getTransmission());
        car.setSeatingCapacity(requestDTO.getSeatingCapacity());
        car.setPricePerDay(requestDTO.getPricePerDay());
        car.setImageUrl(requestDTO.getImageUrl());

        Car updatedCar = carRepository.save(car);

        return convertToDTO(updatedCar);
    }





    // Change Car Status

    public void updateCarStatus(
            Long id,
            String status){


        Car car =
                carRepository.findById(id)

                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Car not found"
                                ));



        car.setStatus(status);


        carRepository.save(car);

    }





    // Delete Car

    public void deleteCar(Long id) {

        Car car = carRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Car not found"));

        carRepository.delete(car);
    }





    // Entity -> DTO Conversion

    private CarResponseDTO convertToDTO(Car car){


        CarResponseDTO responseDTO =
                new CarResponseDTO();



        responseDTO.setId(
                car.getId()
        );


        responseDTO.setBrand(
                car.getBrand()
        );


        responseDTO.setModel(
                car.getModel()
        );


        responseDTO.setManufacturingYear(
                car.getManufacturingYear()
        );


        responseDTO.setRegistrationNumber(
                car.getRegistrationNumber()
        );


        responseDTO.setFuelType(
                car.getFuelType()
        );


        responseDTO.setTransmission(
                car.getTransmission()
        );


        responseDTO.setSeatingCapacity(
                car.getSeatingCapacity()
        );


        responseDTO.setPricePerDay(
                car.getPricePerDay()
        );


        responseDTO.setStatus(
                car.getStatus()
        );


        responseDTO.setImageUrl(
                car.getImageUrl()
        );


        return responseDTO;

    }
    // Search Cars By Brand

    public List<CarResponseDTO> getCarsByBrand(String brand) {

        List<Car> cars = carRepository.findByBrand(brand);

        if (cars.isEmpty()) {
            throw new RuntimeException("No cars found for brand : " + brand);
        }

        List<CarResponseDTO> responseList = new ArrayList<>();

        for (Car car : cars) {
            responseList.add(convertToDTO(car));
        }

        return responseList;
    }

    // Search Cars By Model

    public List<CarResponseDTO> getCarsByModel(String model) {

        List<Car> cars = carRepository.findByModel(model);

        if (cars.isEmpty()) {
            throw new RuntimeException("No cars found for model : " + model);
        }

        List<CarResponseDTO> responseList = new ArrayList<>();

        for (Car car : cars) {
            responseList.add(convertToDTO(car));
        }

        return responseList;
    }

    // Search Cars By Fuel Type

    public List<CarResponseDTO> getCarsByFuelType(String fuelType) {

        List<Car> cars = carRepository.findByFuelType(fuelType);

        if (cars.isEmpty()) {
            throw new RuntimeException("No cars found for fuel type : " + fuelType);
        }

        List<CarResponseDTO> responseList = new ArrayList<>();

        for (Car car : cars) {
            responseList.add(convertToDTO(car));
        }

        return responseList;
    }
    // Search Cars By Transmission

    public List<CarResponseDTO> getCarsByTransmission(String transmission) {

        List<Car> cars = carRepository.findByTransmission(transmission);

        if (cars.isEmpty()) {
            throw new RuntimeException("No cars found for transmission : " + transmission);
        }

        List<CarResponseDTO> responseList = new ArrayList<>();

        for (Car car : cars) {
            responseList.add(convertToDTO(car));
        }

        return responseList;
    }
    // Search Cars By Status

    public List<CarResponseDTO> getCarsByStatus(String status) {

        List<Car> cars = carRepository.findByStatus(status);

        if (cars.isEmpty()) {
            throw new RuntimeException("No cars found with status : " + status);
        }

        List<CarResponseDTO> responseList = new ArrayList<>();

        for (Car car : cars) {
            responseList.add(convertToDTO(car));
        }

        return responseList;
    }



}