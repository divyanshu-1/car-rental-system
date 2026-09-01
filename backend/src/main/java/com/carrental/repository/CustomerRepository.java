package com.carrental.repository;

import com.carrental.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {


    //Duplicate Validation
    boolean existsByEmail(String email);

    boolean existsByDrivingLicenseNumber(String drivingLicenseNumber);

    boolean existsByPhoneNumber(String phoneNumber);

    Optional<Customer> findByDrivingLicenseNumber(String drivingLicenseNumber);

    Optional<Customer> findByPhoneNumber(String phoneNumber);

    Optional<Customer> findByEmail(String email);

    List<Customer> findByLastName(String lastName);

    List<Customer> findByFirstName(String firstName);
}
