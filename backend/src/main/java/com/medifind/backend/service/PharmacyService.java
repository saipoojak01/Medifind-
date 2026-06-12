package com.medifind.backend.service;

import com.medifind.backend.model.Pharmacy;
import com.medifind.backend.repository.PharmacyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PharmacyService {

    @Autowired
    private PharmacyRepository pharmacyRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Pharmacy registerPharmacy(Pharmacy pharmacy) {
        Pharmacy existing = pharmacyRepository.findByEmail(pharmacy.getEmail());
        if (existing != null) {
            throw new RuntimeException("Email already registered!");
        }
        pharmacy.setPassword(passwordEncoder.encode(pharmacy.getPassword()));
        return pharmacyRepository.save(pharmacy);
    }

    public Pharmacy loginPharmacy(String email, String password) {
        Pharmacy pharmacy = pharmacyRepository.findByEmail(email);
        if (pharmacy == null) {
            throw new RuntimeException("Pharmacy not found!");
        }
        if (!passwordEncoder.matches(password, pharmacy.getPassword())) {
            throw new RuntimeException("Invalid password!");
        }
        return pharmacy;
    }
}