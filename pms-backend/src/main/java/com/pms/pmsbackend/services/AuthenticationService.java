package com.pms.pmsbackend.services;

import com.pms.pmsbackend.models.LoginResponseDTO;
import com.pms.pmsbackend.models.Role;
import com.pms.pmsbackend.models.User;
import com.pms.pmsbackend.repository.RoleRepository;
import com.pms.pmsbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthenticationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    public User registerUser(String name, String email, String password) {
        String encodedPassword = passwordEncoder.encode(password);
        Role userRole =roleRepository.findByAuthority("USER").get();

        return userRepository.save(new User(0, name, email, encodedPassword, userRole));
    }

    public LoginResponseDTO loginUser(String email, String password) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );

            String token = tokenService.generateJwt(auth);

            return new LoginResponseDTO(userRepository.findByEmail(email).get(), token);

        } catch (AuthenticationException e) {
            return new LoginResponseDTO(null,"");
        }
    }
}
