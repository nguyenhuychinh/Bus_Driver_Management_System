package com.busdriver.service;

import com.busdriver.model.dto.AuthResponse;
import com.busdriver.model.dto.LoginRequest;
import com.busdriver.model.dto.RegisterRequest;
import com.busdriver.model.entity.UserInfo;
import com.busdriver.repository.UserInfoRepository;
import com.busdriver.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserInfoRepository userInfoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public AuthResponse register(RegisterRequest request) {
        UserInfo userInfo = new UserInfo();
        userInfo.setUsername(request.getUsername());
        userInfo.setPassword(passwordEncoder.encode(request.getPassword()));
        userInfo.setEmail(request.getEmail());
        userInfo.setFullName(request.getFullName());
        userInfo.setRole("USER");

        UserInfo savedUser = userInfoRepository.save(userInfo);
        String token = jwtTokenProvider.generateToken(savedUser.getUsername());

        return new AuthResponse(savedUser.getId(), savedUser.getUsername(), token);
    }

    public AuthResponse login(LoginRequest request) {
        UserInfo userInfo = userInfoRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), userInfo.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtTokenProvider.generateToken(userInfo.getUsername());
        return new AuthResponse(userInfo.getId(), userInfo.getUsername(), token);
    }
}
