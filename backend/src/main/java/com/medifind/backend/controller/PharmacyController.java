package com.medifind.backend.controller;

import com.medifind.backend.config.jwtUtil;
import com.medifind.backend.dto.LoginRequest;
import com.medifind.backend.model.Pharmacy;
import com.medifind.backend.service.PharmacyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/pharmacy")
public class PharmacyController {

    @Autowired
    private PharmacyService pharmacyService;

    @Autowired
    private jwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Pharmacy pharmacy) {
        try {
            Pharmacy saved = pharmacyService.registerPharmacy(pharmacy);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Pharmacy pharmacy = pharmacyService.loginPharmacy(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
            );
            String token = jwtUtil.generateToken(pharmacy.getEmail());
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("shopName", pharmacy.getShopName());
            response.put("role", pharmacy.getRole());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
