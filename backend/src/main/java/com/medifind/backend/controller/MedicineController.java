package com.medifind.backend.controller;

import com.medifind.backend.model.Medicine;
import com.medifind.backend.service.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

    @Autowired
    private MedicineService medicineService;

    @PostMapping("/add/{pharmacyId}")
    public ResponseEntity<?> addMedicine(
            @PathVariable Long pharmacyId,
            @RequestBody Medicine medicine) {
        try {
            Medicine saved = medicineService.addMedicine(pharmacyId, medicine);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/pharmacy/{pharmacyId}")
    public ResponseEntity<?> getMedicines(@PathVariable Long pharmacyId) {
        try {
            List<Medicine> medicines = medicineService.getMedicinesByPharmacy(pharmacyId);
            return ResponseEntity.ok(medicines);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/update/{medicineId}")
    public ResponseEntity<?> updateStock(
            @PathVariable Long medicineId,
            @RequestParam Integer quantity) {
        try {
            Medicine updated = medicineService.updateStock(medicineId, quantity);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchMedicines(@RequestParam String name) {
        try {
            List<Medicine> medicines = medicineService.searchMedicines(name);
            return ResponseEntity.ok(medicines);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}