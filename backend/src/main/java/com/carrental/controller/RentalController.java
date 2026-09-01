package com.carrental.controller;

import com.carrental.dto.RentalRequestDTO;
import com.carrental.dto.RentalResponseDTO;
import com.carrental.entity.Rental;
import com.carrental.service.RentalService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/rentals")
public class RentalController {


    private final RentalService rentalService;


    public RentalController(RentalService rentalService) {
        this.rentalService = rentalService;
    }


    // Create Rental
    @PostMapping
    public RentalResponseDTO createRental(
            @Valid @RequestBody RentalRequestDTO requestDTO) {

        return rentalService.createRental(requestDTO);
    }


    // Get All Rentals
    @GetMapping
    public List<Rental> getAllRentals() {

        return rentalService.getAllRentals();
    }


    // Get Rental By ID
    @GetMapping("/{id}")
    public Rental getRentalById(
            @PathVariable Long id) {

        return rentalService.getRentalById(id);
    }


    // Delete Rental
    @DeleteMapping("/{id}")
    public void deleteRental(
            @PathVariable Long id) {

        rentalService.deleteRental(id);
    }


    // Update Rental
    @PutMapping("/{id}")
    public Rental updateRental(
            @PathVariable Long id,
            @RequestBody Rental rental) {

        return rentalService.updateRental(id, rental);
    }
    // Return Rental
    @PutMapping("/{id}/return")
    public RentalResponseDTO returnRental(
            @PathVariable Long id) {

        return rentalService.returnRental(id);
    }

}