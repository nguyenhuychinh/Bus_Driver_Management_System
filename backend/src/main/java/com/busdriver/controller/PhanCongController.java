package com.busdriver.controller;

import com.busdriver.model.dto.PhanCongDTO;
import com.busdriver.service.PhanCongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/phancong")
@CrossOrigin(origins = "*")
public class PhanCongController {

    @Autowired
    private PhanCongService phanCongService;

    @GetMapping
    public ResponseEntity<List<PhanCongDTO>> getAll() {
        List<PhanCongDTO> assignments = phanCongService.getAll();
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PhanCongDTO> getById(@PathVariable Long id) {
        PhanCongDTO assignment = phanCongService.getById(id);
        return ResponseEntity.ok(assignment);
    }

    @PostMapping
    public ResponseEntity<PhanCongDTO> create(@RequestBody PhanCongDTO dto) {
        PhanCongDTO created = phanCongService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PhanCongDTO> update(@PathVariable Long id, @RequestBody PhanCongDTO dto) {
        PhanCongDTO updated = phanCongService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        phanCongService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/driver/{laixeId}")
    public ResponseEntity<List<PhanCongDTO>> getByLaixeId(@PathVariable Long laixeId) {
        List<PhanCongDTO> assignments = phanCongService.getByLaixeId(laixeId);
        return ResponseEntity.ok(assignments);
    }
}
