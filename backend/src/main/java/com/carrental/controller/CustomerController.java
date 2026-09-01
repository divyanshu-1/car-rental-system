package com.carrental.controller;

import com.carrental.dto.CustomerRequestDTO;
import com.carrental.dto.CustomerResponseDTO;
import com.carrental.dto.LoginRequestDTO;
import com.carrental.dto.LoginResponseDTO;
import com.carrental.entity.Customer;
import com.carrental.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {

        this.customerService = customerService;
    }

    @PostMapping
    public CustomerResponseDTO registerCustomer(
            @Valid @RequestBody CustomerRequestDTO requestDTO) {

        return customerService.registerCustomer(requestDTO);
    }


    @GetMapping
    public List<CustomerResponseDTO> getAllCustomers() {

        return customerService.getAllCustomers();
    }
    @GetMapping("/{id}")
    public Optional<CustomerResponseDTO> getCustomerById(@PathVariable Long id) {

        return customerService.getCustomerById(id);
    }

    @PutMapping("/{id}")
    public CustomerResponseDTO updateCustomer(@PathVariable Long id,
                                   @RequestBody CustomerRequestDTO requestDTO) {

        return customerService.updateCustomer(id, requestDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
    }

    // Search by First Name
    @GetMapping("/firstname/{firstName}")
    public List<CustomerResponseDTO> getCustomersByFirstName(
            @PathVariable String firstName) {

        return customerService.getCustomersByFirstName(firstName);
    }

    // Search by Last Name
    @GetMapping("/lastname/{lastName}")
    public List<CustomerResponseDTO> getCustomersByLastName(
            @PathVariable String lastName) {

        return customerService.getCustomersByLastName(lastName);
    }

    // Search by Email
    @GetMapping("/email/{email}")
    public CustomerResponseDTO getCustomerByEmail(
            @PathVariable String email) {

        return customerService.getCustomerByEmail(email);
    }

    // Search by Phone Number
    @GetMapping("/phone/{phoneNumber}")
    public CustomerResponseDTO getCustomerByPhoneNumber(
            @PathVariable String phoneNumber) {

        return customerService.getCustomerByPhoneNumber(phoneNumber);
    }

    // Search by Driving License Number
    @GetMapping("/license/{licenseNumber}")
    public CustomerResponseDTO getCustomerByDrivingLicenseNumber(
            @PathVariable String licenseNumber) {

        return customerService.getCustomerByDrivingLicenseNumber(licenseNumber);
    }
    @PostMapping("/login")
    public LoginResponseDTO loginCustomer(
            @Valid @RequestBody LoginRequestDTO requestDTO) {

        return customerService.loginCustomer(requestDTO);
    }

}
