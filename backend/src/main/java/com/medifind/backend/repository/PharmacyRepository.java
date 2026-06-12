package com.medifind.backend.repository;

import com.medifind.backend.model.Pharmacy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PharmacyRepository extends JpaRepository<Pharmacy, Long> {

    Pharmacy findByEmail(String email);
}