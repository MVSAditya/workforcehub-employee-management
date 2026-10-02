package com.example.demo.config;

import java.time.LocalDate;
import java.util.List;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.example.demo.model.Employee;
import com.example.demo.repository.EmployeeRepository;

@Component
public class EmployeeDataSeeder implements ApplicationRunner {

    private final EmployeeRepository employeeRepository;

    public EmployeeDataSeeder(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (employeeRepository.count() == 0) {
            List<Employee> seededEmployees = List.of(
                new Employee("Aisha", "Patel", "aisha.patel@company.com", 82000, "IT", "Developer", LocalDate.of(2024, 3, 12)),
                new Employee("Daniel", "Kim", "daniel.kim@company.com", 95000, "Finance", "Analyst", LocalDate.of(2023, 11, 4)),
                new Employee("Priya", "Sharma", "priya.sharma@company.com", 110000, "HR", "Manager", LocalDate.of(2022, 9, 21))
            );

            employeeRepository.saveAll(seededEmployees);
            System.out.println("Seeded random employees for the employee list");
        }
    }
}
