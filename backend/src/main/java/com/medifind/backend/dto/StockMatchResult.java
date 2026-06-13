package com.medifind.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class StockMatchResult {

    private Long pharmacyId;
    private String shopName;
    private String address;
    private String phone;
    private Double latitude;
    private Double longitude;
    private Double distanceKm;
    private int totalMedicines;
    private int availableMedicines;
    private double matchPercentage;
    private String status;
    private List<MedicineStatus> medicineStatuses;

    @Data
    public static class MedicineStatus {
        private String medicineName;
        private boolean available;
        private Integer quantity;
        private Double price;
    }
}
