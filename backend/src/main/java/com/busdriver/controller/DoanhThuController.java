package com.busdriver.controller;

import com.busdriver.model.dto.DoanhThuDTO;
import com.busdriver.model.dto.DoanhThuDetailDTO;
import com.busdriver.service.DoanhThuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doanhthu")
@CrossOrigin(origins = "*")
public class DoanhThuController {

    @Autowired
    private DoanhThuService doanhThuService;

    @GetMapping
    public ResponseEntity<List<DoanhThuDTO>> getAll(
            @RequestParam(required = false) String sort,
            @RequestParam(required = false, defaultValue = "desc") String direction) {
        
        // Parse sort parameter: "doanhThu" or "ngaylai"
        String sortField = null;
        if (sort != null && !sort.isEmpty()) {
            sortField = sort;
        }
        
        List<DoanhThuDTO> revenues = doanhThuService.getAll(sortField, direction);
        return ResponseEntity.ok(revenues);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoanhThuDTO> getById(@PathVariable Long id) {
        DoanhThuDTO revenue = doanhThuService.getById(id);
        return ResponseEntity.ok(revenue);
    }

    @GetMapping("/{id}/detail")
    public ResponseEntity<DoanhThuDetailDTO> getDetailById(@PathVariable Long id) {
        DoanhThuDetailDTO revenue = doanhThuService.getDetailById(id);
        return ResponseEntity.ok(revenue);
    }

    @GetMapping("/{id}/thong-tin")
    public ResponseEntity<DoanhThuDetailDTO> getThongTinById(@PathVariable Long id) {
        DoanhThuDetailDTO revenue = doanhThuService.getDetailById(id);
        return ResponseEntity.ok(revenue);
    }

    @GetMapping("/search")
    public ResponseEntity<List<DoanhThuDTO>> search(
            @RequestParam(required = false) Long phanCongId,
            @RequestParam(required = false) String ngay) {
        List<DoanhThuDTO> revenues = doanhThuService.search(phanCongId, ngay);
        return ResponseEntity.ok(revenues);
    }

    @GetMapping("/sort")
    public ResponseEntity<List<DoanhThuDTO>> sort(
            @RequestParam(required = false, defaultValue = "doanhthu") String by,
            @RequestParam(required = false, defaultValue = "desc") String order) {
        List<DoanhThuDTO> revenues = doanhThuService.getAll(by, order);
        return ResponseEntity.ok(revenues);
    }

    @PostMapping
    public ResponseEntity<DoanhThuDTO> create(@RequestBody DoanhThuDTO dto) {
        DoanhThuDTO created = doanhThuService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DoanhThuDTO> update(@PathVariable Long id, @RequestBody DoanhThuDTO dto) {
        DoanhThuDTO updated = doanhThuService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        doanhThuService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
