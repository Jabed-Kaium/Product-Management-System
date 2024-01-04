package com.pms.pmsbackend;

import com.pms.pmsbackend.models.Role;
import com.pms.pmsbackend.models.User;
import com.pms.pmsbackend.repository.RoleRepository;
import com.pms.pmsbackend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class PmsBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(PmsBackendApplication.class, args);
    }

    @Bean
    CommandLineRunner run(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (roleRepository.findByAuthority("ADMIN").isPresent()) return;

            Role adminRole = roleRepository.save(new Role("ADMIN"));
            roleRepository.save(new Role("USER"));

            User admin = new User(1, "Admin", "admin@gmail.com", passwordEncoder.encode("12345678"), adminRole);

            userRepository.save(admin);
        };
    }

}
