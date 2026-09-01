package com.carrental.controller;

import com.carrental.dto.CarRequestDTO;
import com.carrental.dto.CarResponseDTO;
import com.carrental.service.CarService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
public class CarController {

    private final CarService carService;

    public CarController(CarService carService) {
        this.carService = carService;
    }

    @PostMapping
    public CarResponseDTO registerCar(
            @Valid @RequestBody CarRequestDTO requestDTO) {

        return carService.registerCar(requestDTO);
    }

    @GetMapping
    public List<CarResponseDTO> getAllCars() {
        return carService.getAllCars();
    }

    @GetMapping("/{id}")
    public CarResponseDTO getCarById(@PathVariable Long id) {
        return carService.getCarById(id);
    }

    @PutMapping("/{id}")
    public CarResponseDTO updateCar(
            @PathVariable Long id,
            @Valid @RequestBody CarRequestDTO requestDTO) {

        return carService.updateCar(id, requestDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
    }
    @GetMapping("/brand/{brand}")
    public List<CarResponseDTO> getCarsByBrand(
            @PathVariable String brand) {

        return carService.getCarsByBrand(brand);
    }
    @GetMapping("/model/{model}")
    public List<CarResponseDTO> getCarsByModel(
            @PathVariable String model) {

        return carService.getCarsByModel(model);
    }
    @GetMapping("/fuel/{fuelType}")
    public List<CarResponseDTO> getCarsByFuelType(
            @PathVariable String fuelType) {

        return carService.getCarsByFuelType(fuelType);
    }
    @GetMapping("/transmission/{transmission}")
    public List<CarResponseDTO> getCarsByTransmission(
            @PathVariable String transmission) {

        return carService.getCarsByTransmission(transmission);
    }
    @GetMapping("/status/{status}")
    public List<CarResponseDTO> getCarsByStatus(
            @PathVariable String status) {

        return carService.getCarsByStatus(status);
    }
    @GetMapping("/page")
    public Page<CarResponseDTO> getCarsWithPagination(

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "5") int size) {

        return carService.getCarsWithPagination(page, size);
    }


}