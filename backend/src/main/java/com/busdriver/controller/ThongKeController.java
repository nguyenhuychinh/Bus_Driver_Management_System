package com.busdriver.controller;

import com.busdriver.model.dto.ThongKeDTO;
import com.busdriver.service.ThongKeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/thongke")
@CrossOrigin(origins = "*")
public class ThongKeController {

    @Autowired
    private ThongKeService thongKeService;

    @GetMapping("/daily")
    public ResponseEntity<Map<String, Object>> getDailyRevenue(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);

        Map<LocalDate, BigDecimal> dailyRevenue = thongKeService.getDailyRevenue(start, end);

        Map<String, Object> response = new HashMap<>();
        response.put("data", dailyRevenue);
        response.put("total", dailyRevenue.values().stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/monthly")
    public ResponseEntity<Map<String, Object>> getMonthlyRevenue(
            @RequestParam int year) {
        Map<YearMonth, BigDecimal> monthlyRevenue = thongKeService.getMonthlyRevenue(year);

        Map<String, Object> response = new HashMap<>();
        response.put("data", monthlyRevenue);
        response.put("total", monthlyRevenue.values().stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        response.put("year", year);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/top-drivers")
    public ResponseEntity<Map<String, Object>> getTopDrivers(
            @RequestParam(defaultValue = "10") int limit) {
        List<ThongKeDTO> topDrivers = thongKeService.getTopDrivers(limit);

        Map<String, Object> response = new HashMap<>();
        response.put("drivers", topDrivers);
        response.put("count", topDrivers.size());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalRevenue", thongKeService.getTotalRevenue());
        summary.put("totalSalaryPaid", thongKeService.getTotalSalaryPaid());
        summary.put("totalTrips", thongKeService.getTotalTrips());
        summary.put("totalDrivers", thongKeService.getTotalDrivers());

        return ResponseEntity.ok(summary);
    }
}
