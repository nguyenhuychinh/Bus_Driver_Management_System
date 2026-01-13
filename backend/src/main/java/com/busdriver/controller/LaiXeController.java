package com.busdriver.controller;

import com.busdriver.model.dto.LaiXeDTO;
import com.busdriver.service.LaiXeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/laixe")
@CrossOrigin(origins = "*")
public class LaiXeController {

    @Autowired
    private LaiXeService laiXeService;

    @GetMapping
    public ResponseEntity<List<LaiXeDTO>> getAll() {
        List<LaiXeDTO> drivers = laiXeService.getAll();
        return ResponseEntity.ok(drivers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LaiXeDTO> getById(@PathVariable Long id) {
        LaiXeDTO driver = laiXeService.getById(id);
        return ResponseEntity.ok(driver);
    }

    @PostMapping
    public ResponseEntity<LaiXeDTO> create(@RequestBody LaiXeDTO dto) {
        LaiXeDTO created = laiXeService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LaiXeDTO> update(@PathVariable Long id, @RequestBody LaiXeDTO dto) {
        LaiXeDTO updated = laiXeService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        laiXeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
