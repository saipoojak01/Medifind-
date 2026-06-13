package com.medifind.backend.service;

import com.medifind.backend.dto.StockMatchResult;
import com.medifind.backend.model.Medicine;
import com.medifind.backend.model.Pharmacy;
import com.medifind.backend.repository.MedicineRepository;
import com.medifind.backend.repository.PharmacyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class StockMatchService {

    @Autowired
    private PharmacyRepository pharmacyRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    public List<StockMatchResult> findPharmacies(
            List<String> medicineNames,
            Double userLat,
            Double userLon,
            Double radiusKm) {

        List<Pharmacy> allPharmacies = pharmacyRepository.findAll();
        List<StockMatchResult> results = new ArrayList<>();

        for (Pharmacy pharmacy : allPharmacies) {
            double distance = calculateDistance(
                    userLat, userLon,
                    pharmacy.getLatitude(), pharmacy.getLongitude()
            );

            if (distance <= radiusKm) {
                StockMatchResult result = checkStock(
                        pharmacy, medicineNames, distance
                );
                results.add(result);
            }
        }

        // Sort by match percentage descending
        results.sort((a, b) ->
                Double.compare(b.getMatchPercentage(), a.getMatchPercentage())
        );

        return results;
    }

    private StockMatchResult checkStock(
            Pharmacy pharmacy,
            List<String> medicineNames,
            Double distance) {

        List<Medicine> medicines = medicineRepository.findByPharmacy(pharmacy);
        List<StockMatchResult.MedicineStatus> statuses = new ArrayList<>();
        int available = 0;

        for (String medicineName : medicineNames) {
            StockMatchResult.MedicineStatus status =
                    new StockMatchResult.MedicineStatus();
            status.setMedicineName(medicineName);

            Medicine found = medicines.stream()
                    .filter(m -> m.getName()
                            .equalsIgnoreCase(medicineName) && m.getQuantity() > 0)
                    .findFirst()
                    .orElse(null);

            if (found != null) {
                status.setAvailable(true);
                status.setQuantity(found.getQuantity());
                status.setPrice(found.getPrice());
                available++;
            } else {
                status.setAvailable(false);
            }
            statuses.add(status);
        }

        double matchPct = ((double) available / medicineNames.size()) * 100;

        StockMatchResult result = new StockMatchResult();
        result.setPharmacyId(pharmacy.getId());
        result.setShopName(pharmacy.getShopName());
        result.setAddress(pharmacy.getAddress());
        result.setPhone(pharmacy.getPhone());
        result.setLatitude(pharmacy.getLatitude());
        result.setLongitude(pharmacy.getLongitude());
        result.setDistanceKm(Math.round(distance * 10.0) / 10.0);
        result.setTotalMedicines(medicineNames.size());
        result.setAvailableMedicines(available);
        result.setMatchPercentage(matchPct);
        result.setMedicineStatuses(statuses);

        if (matchPct == 100) result.setStatus("FULL");
        else if (matchPct > 0) result.setStatus("PARTIAL");
        else result.setStatus("NONE");

        return result;
    }

    private double calculateDistance(
            double lat1, double lon1,
            double lat2, double lon2) {

        final int R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1))
                * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}