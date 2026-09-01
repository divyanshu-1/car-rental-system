package com.carrental.config;

import com.carrental.entity.Car;
import com.carrental.entity.Customer;
import com.carrental.repository.CarRepository;
import com.carrental.repository.CustomerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CustomerRepository customerRepository;
    private final CarRepository carRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(CustomerRepository customerRepository,
                           CarRepository carRepository,
                           PasswordEncoder passwordEncoder) {
        this.customerRepository = customerRepository;
        this.carRepository = carRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed default Admin Account if not existing
        String adminEmail = "admin@carrental.com";
        if (customerRepository.findByEmail(adminEmail).isEmpty()) {
            Customer admin = new Customer();
            admin.setFirstName("Admin");
            admin.setLastName("System");
            admin.setEmail(adminEmail);
            admin.setPhoneNumber("9999999999");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setAddress("Headquarters, Admin HQ");
            admin.setDrivingLicenseNumber("DL-ADMIN-001");
            admin.setRole("ADMIN");

            customerRepository.save(admin);
            System.out.println("==================================================");
            System.out.println("✅ DEFAULT ADMIN CREATED:");
            System.out.println("   Email: " + adminEmail);
            System.out.println("   Password: admin123");
            System.out.println("==================================================");
        }

        // Seed Sample Cars if fleet is empty
        if (carRepository.count() == 0) {
            carRepository.save(new Car(null, "Tesla", "Model 3", 2024, "EV-101-TS", "ELECTRIC", "AUTOMATIC", 5, 95.0, "AVAILABLE", "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&auto=format&fit=crop"));
            carRepository.save(new Car(null, "BMW", "3 Series", 2024, "BM-302-LUX", "PETROL", "AUTOMATIC", 5, 110.0, "AVAILABLE", "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&auto=format&fit=crop"));
            carRepository.save(new Car(null, "Honda", "Civic", 2023, "HN-505-CV", "HYBRID", "AUTOMATIC", 5, 55.0, "AVAILABLE", "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=600&auto=format&fit=crop"));
            carRepository.save(new Car(null, "Toyota", "Camry", 2024, "TY-808-CM", "PETROL", "AUTOMATIC", 5, 65.0, "AVAILABLE", "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&auto=format&fit=crop"));
            System.out.println("✅ Sample fleet vehicles seeded successfully.");
        }
    }
}
