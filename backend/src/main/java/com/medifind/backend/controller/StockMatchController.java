package com.medifind.backend.controller;

import com.medifind.backend.dto.StockMatchResult;
import com.medifind.backend.service.StockMatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
public class StockMatchController {

    @Autowired
    private StockMatchService stockMatchService;

    @GetMapping("/pharmacies")
    public ResponseEntity<?> findPharmacies(
            @RequestParam List<String> medicines,
            @RequestParam Double lat,
            @RequestParam Double lon,
            @RequestParam(defaultValue = "5.0") Double radius) {
        try {
            List<StockMatchResult> results = stockMatchService.findPharmacies(
                    medicines, lat, lon, radius
            );
            return ResponseEntity.ok(results);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
