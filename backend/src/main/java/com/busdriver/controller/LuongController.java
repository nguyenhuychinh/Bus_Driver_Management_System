package com.busdriver.controller;

import com.busdriver.model.dto.LuongCalcDTO;
import com.busdriver.model.dto.LuongPayDTO;
import com.busdriver.model.dto.LuongResetDTO;
import com.busdriver.model.dto.LuongTotalDTO;
import com.busdriver.service.LuongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/luong")
@CrossOrigin(origins = "*")
public class LuongController {

    @Autowired
    private LuongService luongService;

    @GetMapping("/calc")
    public ResponseEntity<LuongCalcDTO> calculateSalary(
            @RequestParam Long laixeId,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to) {
        
        LocalDate fromDate = from != null && !from.isEmpty() ? LocalDate.parse(from) : null;
        LocalDate toDate = to != null && !to.isEmpty() ? LocalDate.parse(to) : null;
        
        LuongCalcDTO result = luongService.calculateSalary(laixeId, fromDate, toDate);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/pay")
    public ResponseEntity<LuongPayDTO> paySalary(@RequestBody LuongPayDTO request) {
        LuongPayDTO result = luongService.paySalary(request.getLaixeId(), request.getSoTienThanhToan());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/total")
    public ResponseEntity<LuongTotalDTO> calculateTotal(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to) {
        
        LocalDate fromDate = from != null && !from.isEmpty() ? LocalDate.parse(from) : null;
        LocalDate toDate = to != null && !to.isEmpty() ? LocalDate.parse(to) : null;
        
        LuongTotalDTO result = luongService.calculateTotal(fromDate, toDate);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/reset")
    public ResponseEntity<Map<String, String>> resetSalary(@RequestBody LuongResetDTO request) {
        String mode = request.getMode() != null ? request.getMode() : "RESET_PAID_ONLY";
        luongService.resetSalary(mode);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Cài lại lương thành công");
        return ResponseEntity.ok(response);
    }
}
