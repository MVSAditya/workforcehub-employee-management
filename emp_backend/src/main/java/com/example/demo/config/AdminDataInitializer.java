package com.example.demo.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.example.demo.adminModel.adminModel;
import com.example.demo.adminRepository.adminRepository;

@Component
public class AdminDataInitializer implements ApplicationRunner {

    private static final String DEFAULT_ADMIN_USERNAME = "admin_4827";
    private static final String DEFAULT_ADMIN_PASSWORD = "R4nd0m!A7";

    private final adminRepository adminRepository;

    public AdminDataInitializer(adminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (adminRepository.count() == 0) {
            adminRepository.save(new adminModel(DEFAULT_ADMIN_USERNAME, DEFAULT_ADMIN_PASSWORD));
            System.out.println("Seeded default admin credentials -> username: " + DEFAULT_ADMIN_USERNAME + ", password: " + DEFAULT_ADMIN_PASSWORD);
        }
    }
}
