package com.medifind.backend.controller;

import com.medifind.backend.service.OcrService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/ocr")
public class OcrController {

    @Autowired
    private OcrService ocrService;

    @PostMapping("/scan")
    public ResponseEntity<?> scanPrescription(
            @RequestParam("file") MultipartFile file) {
        try {
            List<String> medicines = ocrService.extractMedicines(file);
            return ResponseEntity.ok(medicines);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}