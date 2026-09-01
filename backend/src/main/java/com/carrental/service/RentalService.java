package com.carrental.service;

import com.carrental.dto.RentalRequestDTO;
import com.carrental.dto.RentalResponseDTO;
import com.carrental.entity.Car;
import com.carrental.entity.Customer;
import com.carrental.entity.Rental;
import com.carrental.repository.CarRepository;
import com.carrental.repository.CustomerRepository;
import com.carrental.repository.RentalRepository;

import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.List;


@Service
public class RentalService {


    private final RentalRepository rentalRepository;
    private final CustomerRepository customerRepository;
    private final CarRepository carRepository;


    public RentalService(RentalRepository rentalRepository,
                         CustomerRepository customerRepository,
                         CarRepository carRepository) {

        this.rentalRepository = rentalRepository;
        this.customerRepository = customerRepository;
        this.carRepository = carRepository;
    }



    // CREATE RENTAL
    public RentalResponseDTO createRental(RentalRequestDTO requestDTO) {


        // Find Customer
        Customer customer = customerRepository
                .findById(requestDTO.getCustomerId())
                .orElseThrow(() ->
                        new RuntimeException("Customer not found"));



        // Find Car
        Car car = carRepository
                .findById(requestDTO.getCarId())
                .orElseThrow(() ->
                        new RuntimeException("Car not found"));

        System.out.println("================================");
        System.out.println("Car ID = " + car.getId());
        System.out.println("Car Status = " + car.getStatus());
        System.out.println("================================");

// Check if car is already rented
        if ("RENTED".equalsIgnoreCase(car.getStatus())) {
            throw new RuntimeException("Car is already rented");
        }



        // Validate Dates
        if(requestDTO.getReturnDate()
                .isBefore(requestDTO.getRentalDate())) {

            throw new RuntimeException(
                    "Return date cannot be before rental date"
            );
        }



        // Create Rental Object
        Rental rental = new Rental();


        rental.setCustomer(customer);
        rental.setCar(car);
        rental.setRentalDate(requestDTO.getRentalDate());
        rental.setReturnDate(requestDTO.getReturnDate());



        // Calculate Total Amount

        long days = ChronoUnit.DAYS.between(
                requestDTO.getRentalDate(),
                requestDTO.getReturnDate()
        );


        // If same day rental consider 1 day
        if(days == 0){
            days = 1;
        }


        double totalAmount =
                days * car.getPricePerDay();


        rental.setTotalAmount(totalAmount);



        // Default Status
        rental.setStatus("BOOKED");

// Change Car Status
        car.setStatus("RENTED");
        carRepository.save(car);

// Save Rental
        Rental savedRental = rentalRepository.save(rental);




        // Convert Entity to Response DTO

        RentalResponseDTO responseDTO =
                new RentalResponseDTO();


        responseDTO.setId(savedRental.getId());



        // Customer Details

        responseDTO.setCustomerName(
                customer.getFirstName()
                        + " "
                        + customer.getLastName()
        );


        responseDTO.setCustomerEmail(
                customer.getEmail()
        );


        responseDTO.setCustomerPhone(
                customer.getPhoneNumber()
        );



        // Car Details

        responseDTO.setCarBrand(
                car.getBrand()
        );


        responseDTO.setCarModel(
                car.getModel()
        );


        responseDTO.setRegistrationNumber(
                car.getRegistrationNumber()
        );



        // Rental Details

        responseDTO.setRentalDate(
                savedRental.getRentalDate()
        );


        responseDTO.setReturnDate(
                savedRental.getReturnDate()
        );


        responseDTO.setTotalAmount(
                savedRental.getTotalAmount()
        );


        responseDTO.setStatus(
                savedRental.getStatus()
        );



        return responseDTO;
    }





    // READ ALL RENTALS

    public List<Rental> getAllRentals() {

        return rentalRepository.findAll();
    }





    // READ RENTAL BY ID

    public Rental getRentalById(Long id) {


        return rentalRepository.findById(id)

                .orElseThrow(() ->
                        new RuntimeException(
                                "Rental not found"
                        ));
    }





    // UPDATE RENTAL

    public Rental updateRental(Long id, Rental rental) {


        Rental existingRental =
                rentalRepository.findById(id)

                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Rental not found"
                                ));




        existingRental.setRentalDate(
                rental.getRentalDate()
        );


        existingRental.setReturnDate(
                rental.getReturnDate()
        );


        existingRental.setStatus(
                rental.getStatus()
        );



        // Recalculate Amount after date update

        long days = ChronoUnit.DAYS.between(
                rental.getRentalDate(),
                rental.getReturnDate()
        );


        if(days == 0){
            days = 1;
        }


        double totalAmount =
                days *
                        existingRental.getCar()
                                .getPricePerDay();



        existingRental.setTotalAmount(
                totalAmount
        );



        return rentalRepository.save(existingRental);
    }





    // DELETE RENTAL

    public void deleteRental(Long id) {

        // Find Rental
        Rental rental = rentalRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Rental not found"));

        // Get the associated car
        Car car = rental.getCar();

        // If rental is still active, make the car available
        if ("BOOKED".equalsIgnoreCase(rental.getStatus())) {

            car.setStatus("AVAILABLE");
            carRepository.save(car);
        }

        // Delete rental
        rentalRepository.delete(rental);
    }

    // RETURN RENTAL

    public RentalResponseDTO returnRental(Long rentalId) {

        // Find Rental
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() ->
                        new RuntimeException("Rental not found"));

        // Already Returned?
        if ("RETURNED".equalsIgnoreCase(rental.getStatus())) {
            throw new RuntimeException("Rental is already returned");
        }

        // Get Car
        Car car = rental.getCar();

        // Update Status
        rental.setStatus("RETURNED");
        car.setStatus("AVAILABLE");

        // Save Changes
        carRepository.save(car);
        Rental updatedRental = rentalRepository.save(rental);

        // Prepare Response
        RentalResponseDTO responseDTO = new RentalResponseDTO();

        responseDTO.setId(updatedRental.getId());

        responseDTO.setCustomerName(
                updatedRental.getCustomer().getFirstName() + " " +
                        updatedRental.getCustomer().getLastName());

        responseDTO.setCustomerEmail(
                updatedRental.getCustomer().getEmail());

        responseDTO.setCustomerPhone(
                updatedRental.getCustomer().getPhoneNumber());

        responseDTO.setCarBrand(
                updatedRental.getCar().getBrand());

        responseDTO.setCarModel(
                updatedRental.getCar().getModel());

        responseDTO.setRegistrationNumber(
                updatedRental.getCar().getRegistrationNumber());

        responseDTO.setRentalDate(
                updatedRental.getRentalDate());

        responseDTO.setReturnDate(
                updatedRental.getReturnDate());

        responseDTO.setTotalAmount(
                updatedRental.getTotalAmount());

        responseDTO.setStatus(
                updatedRental.getStatus());

        return responseDTO;
    }

}