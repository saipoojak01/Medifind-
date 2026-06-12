package com.medifind.backend.repository;

import com.medifind.backend.model.Medicine;
import com.medifind.backend.model.Pharmacy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    List<Medicine> findByPharmacy(Pharmacy pharmacy);

    List<Medicine> findByNameContainingIgnoreCase(String name);
}