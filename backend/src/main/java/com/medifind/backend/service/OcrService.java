package com.medifind.backend.service;

import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

@Service
public class OcrService {

    public List<String> extractMedicines(MultipartFile file)
            throws IOException, TesseractException {

        Path tempFile = Files.createTempFile("prescription", ".jpg");
        file.transferTo(tempFile.toFile());

        Tesseract tesseract = new Tesseract();
        tesseract.setDatapath("src/main/resources/tessdata");
        tesseract.setLanguage("eng");

        String extractedText = tesseract.doOCR(tempFile.toFile());

        Files.deleteIfExists(tempFile);

        List<String> medicines = new ArrayList<>();
        String[] lines = extractedText.split("\n");

        for (String line : lines) {
            line = line.trim();
            if (line.length() > 2) {
                medicines.add(line);
            }
        }

        return medicines;
    }
}