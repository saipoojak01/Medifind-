package com.medifind.backend.service;

import com.medifind.backend.model.Medicine;
import com.medifind.backend.model.Pharmacy;
import com.medifind.backend.repository.MedicineRepository;
import com.medifind.backend.repository.PharmacyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicineService {

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private PharmacyRepository pharmacyRepository;

    public Medicine addMedicine(Long pharmacyId, Medicine medicine) {
        Pharmacy pharmacy = pharmacyRepository.findById(pharmacyId)
                .orElseThrow(() -> new RuntimeException("Pharmacy not found!"));
        medicine.setPharmacy(pharmacy);
        return medicineRepository.save(medicine);
    }

    public List<Medicine> getMedicinesByPharmacy(Long pharmacyId) {
        Pharmacy pharmacy = pharmacyRepository.findById(pharmacyId)
                .orElseThrow(() -> new RuntimeException("Pharmacy not found!"));
        return medicineRepository.findByPharmacy(pharmacy);
    }

    public Medicine updateStock(Long medicineId, Integer quantity) {
        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found!"));
        medicine.setQuantity(quantity);
        return medicineRepository.save(medicine);
    }

    public List<Medicine> searchMedicines(String name) {
        return medicineRepository.findByNameContainingIgnoreCase(name);
    }
}
