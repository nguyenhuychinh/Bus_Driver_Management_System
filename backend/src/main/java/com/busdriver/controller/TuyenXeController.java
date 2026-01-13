package com.busdriver.controller;

import com.busdriver.model.dto.TuyenXeDTO;
import com.busdriver.service.TuyenXeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tuyenxe")
@CrossOrigin(origins = "*")
public class TuyenXeController {

    @Autowired
    private TuyenXeService tuyenXeService;

    @GetMapping
    public ResponseEntity<List<TuyenXeDTO>> getAll() {
        List<TuyenXeDTO> routes = tuyenXeService.getAll();
        return ResponseEntity.ok(routes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TuyenXeDTO> getById(@PathVariable Long id) {
        TuyenXeDTO route = tuyenXeService.getById(id);
        return ResponseEntity.ok(route);
    }

    @PostMapping
    public ResponseEntity<TuyenXeDTO> create(@RequestBody TuyenXeDTO dto) {
        TuyenXeDTO created = tuyenXeService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TuyenXeDTO> update(@PathVariable Long id, @RequestBody TuyenXeDTO dto) {
        TuyenXeDTO updated = tuyenXeService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        tuyenXeService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<TuyenXeDTO>> search(@RequestParam String q) {
        List<TuyenXeDTO> results = tuyenXeService.search(q);
        return ResponseEntity.ok(results);
    }
}
