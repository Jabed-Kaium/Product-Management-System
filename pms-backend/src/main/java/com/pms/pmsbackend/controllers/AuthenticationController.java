package com.pms.pmsbackend.controllers;

import com.pms.pmsbackend.models.LoginDTO;
import com.pms.pmsbackend.models.LoginResponseDTO;
import com.pms.pmsbackend.models.RegistrationDTO;
import com.pms.pmsbackend.models.User;
import com.pms.pmsbackend.services.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin("http://localhost:5173")
public class AuthenticationController {

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/register")
    public User registerUser(@RequestBody RegistrationDTO body) {
        return authenticationService.registerUser(body.getName(), body.getEmail(), body.getPassword());
    }

    @PostMapping("/login")
    public LoginResponseDTO loginUser(@RequestBody LoginDTO body) {
        return authenticationService.loginUser(body.getEmail(), body.getPassword());
    }
}
