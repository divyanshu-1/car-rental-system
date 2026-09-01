package com.carrental.service;

import com.carrental.dto.CustomerRequestDTO;
import com.carrental.dto.CustomerResponseDTO;
import com.carrental.dto.LoginRequestDTO;
import com.carrental.dto.LoginResponseDTO;
import com.carrental.entity.Customer;
import com.carrental.repository.CustomerRepository;
import com.carrental.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public CustomerService(CustomerRepository customerRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // Register Customer using DTO
    public CustomerResponseDTO registerCustomer(CustomerRequestDTO requestDTO) {

        // Convert Request DTO to Entity
        Customer customer = new Customer();
        customer.setFirstName(requestDTO.getFirstName());
        customer.setLastName(requestDTO.getLastName());
        customer.setEmail(requestDTO.getEmail());
        customer.setPhoneNumber(requestDTO.getPhoneNumber());
        customer.setPassword(passwordEncoder.encode(requestDTO.getPassword()));
        customer.setAddress(requestDTO.getAddress());
        customer.setDrivingLicenseNumber(requestDTO.getDrivingLicenseNumber());
        if (requestDTO.getRole() != null && !requestDTO.getRole().isBlank()) {
            customer.setRole(requestDTO.getRole().toUpperCase());
        } else if (requestDTO.getEmail() != null && requestDTO.getEmail().toLowerCase().contains("admin")) {
            customer.setRole("ADMIN");
        } else {
            customer.setRole("USER");
        }

        // Save Entity
        Customer savedCustomer = customerRepository.save(customer);

        // Convert Entity to Response DTO
        CustomerResponseDTO responseDTO = new CustomerResponseDTO();
        responseDTO.setId(savedCustomer.getId());
        responseDTO.setFirstName(savedCustomer.getFirstName());
        responseDTO.setLastName(savedCustomer.getLastName());
        responseDTO.setEmail(savedCustomer.getEmail());
        responseDTO.setPhoneNumber(savedCustomer.getPhoneNumber());
        responseDTO.setAddress(savedCustomer.getAddress());
        responseDTO.setRole(savedCustomer.getRole());

        return responseDTO;
    }
    public LoginResponseDTO loginCustomer(LoginRequestDTO requestDTO) {

        Customer customer = (Customer) customerRepository
                .findByEmail(requestDTO.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Email not found"));

        if (!passwordEncoder.matches(requestDTO.getPassword(), customer.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        LoginResponseDTO responseDTO = new LoginResponseDTO();

        responseDTO.setId(customer.getId());
        responseDTO.setFirstName(customer.getFirstName());
        responseDTO.setLastName(customer.getLastName());
        responseDTO.setEmail(customer.getEmail());
        responseDTO.setToken(jwtUtil.generateToken(customer.getEmail()));
        responseDTO.setRole(customer.getRole());

        return responseDTO;
    }


    public List<CustomerResponseDTO> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .toList();
    }

    public Optional<CustomerResponseDTO> getCustomerById(Long id) {
        return customerRepository.findById(id)
                .map(this::convertToResponseDTO);
    }

    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }

    public CustomerResponseDTO updateCustomer(Long id, CustomerRequestDTO requestDTO) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        customer.setFirstName(requestDTO.getFirstName());
        customer.setLastName(requestDTO.getLastName());
        customer.setEmail(requestDTO.getEmail());
        customer.setPhoneNumber(requestDTO.getPhoneNumber());
        if (requestDTO.getPassword() != null && !requestDTO.getPassword().isBlank()) {
            customer.setPassword(passwordEncoder.encode(requestDTO.getPassword()));
        }
        customer.setAddress(requestDTO.getAddress());
        customer.setDrivingLicenseNumber(requestDTO.getDrivingLicenseNumber());
        if (requestDTO.getRole() != null && !requestDTO.getRole().isBlank()) {
            customer.setRole(requestDTO.getRole().toUpperCase());
        }
        Customer updatedCustomer = customerRepository.save(customer);
        return convertToResponseDTO(updatedCustomer);
    }

    private CustomerResponseDTO convertToResponseDTO(Customer customer) {
        if (customer == null) {
            return null;
        }
        CustomerResponseDTO responseDTO = new CustomerResponseDTO();
        responseDTO.setId(customer.getId());
        responseDTO.setFirstName(customer.getFirstName());
        responseDTO.setLastName(customer.getLastName());
        responseDTO.setEmail(customer.getEmail());
        responseDTO.setPhoneNumber(customer.getPhoneNumber());
        responseDTO.setAddress(customer.getAddress());
        responseDTO.setRole(customer.getRole());
        return responseDTO;
    }

    // ==========================================
    // SEARCH CUSTOMERS
    // ==========================================

    // Search by First Name
    public List<CustomerResponseDTO> getCustomersByFirstName(String firstName) {
        return customerRepository.findByFirstName(firstName).stream()
                .map(this::convertToResponseDTO)
                .toList();
    }

    // Search by Last Name
    public List<CustomerResponseDTO> getCustomersByLastName(String lastName) {
        return customerRepository.findByLastName(lastName).stream()
                .map(this::convertToResponseDTO)
                .toList();
    }

    // Search by Email
    public CustomerResponseDTO getCustomerByEmail(String email) {
        return customerRepository.findByEmail(email)
                .map(obj -> convertToResponseDTO((Customer) obj))
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    // Search by Phone Number
    public CustomerResponseDTO getCustomerByPhoneNumber(String phoneNumber) {
        return customerRepository.findByPhoneNumber(phoneNumber)
                .map(obj -> convertToResponseDTO((Customer) obj))
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    // Search by Driving License Number
    public CustomerResponseDTO getCustomerByDrivingLicenseNumber(String drivingLicenseNumber) {
        return customerRepository.findByDrivingLicenseNumber(drivingLicenseNumber)
                .map(obj -> convertToResponseDTO((Customer) obj))
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }
}