package com.busdriver.service;

import com.busdriver.model.dto.TuyenXeDTO;
import com.busdriver.model.entity.TuyenXe;
import com.busdriver.repository.TuyenXeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TuyenXeService {

    @Autowired
    private TuyenXeRepository tuyenXeRepository;

    public List<TuyenXeDTO> getAll() {
        return tuyenXeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TuyenXeDTO getById(Long id) {
        TuyenXe tuyenXe = tuyenXeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tuyến xe"));
        return convertToDTO(tuyenXe);
    }

    public TuyenXeDTO create(TuyenXeDTO dto) {
        validate(dto);
        TuyenXe tuyenXe = convertToEntity(dto);
        TuyenXe saved = tuyenXeRepository.save(tuyenXe);
        return convertToDTO(saved);
    }

    public TuyenXeDTO update(Long id, TuyenXeDTO dto) {
        validate(dto);
        TuyenXe tuyenXe = tuyenXeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tuyến xe"));

        tuyenXe.setTentuyenxe(dto.getTentuyenxe());
        tuyenXe.setKhoangcach(dto.getKhoangcach());
        tuyenXe.setSodiemdung(dto.getSodiemdung());

        TuyenXe updated = tuyenXeRepository.save(tuyenXe);
        return convertToDTO(updated);
    }

    public void delete(Long id) {
        if (!tuyenXeRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tuyến xe");
        }
        try {
            tuyenXeRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không thể xóa tuyến xe này. Có thể đang được sử dụng trong phân công.");
        }
    }

    public List<TuyenXeDTO> search(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAll();
        }
        
        // Try to parse as Long (ID)
        try {
            Long id = Long.parseLong(keyword.trim());
            TuyenXeDTO byId = getById(id);
            return List.of(byId);
        } catch (NumberFormatException e) {
            // Not a number, search by name
            List<TuyenXe> routes = tuyenXeRepository.findByTentuyenxeContainingIgnoreCase(keyword.trim());
            return routes.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (ResponseStatusException e) {
            // ID not found, return empty list
            return List.of();
        }
    }

    private void validate(TuyenXeDTO dto) {
        if (dto.getTentuyenxe() == null || dto.getTentuyenxe().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên tuyến xe là bắt buộc");
        }

        if (dto.getKhoangcach() != null && dto.getKhoangcach().compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Khoảng cách phải >= 0");
        }

        if (dto.getSodiemdung() != null && dto.getSodiemdung() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số điểm dừng phải >= 0");
        }
    }

    private TuyenXeDTO convertToDTO(TuyenXe tuyenXe) {
        TuyenXeDTO dto = new TuyenXeDTO();
        dto.setId(tuyenXe.getId());
        dto.setTentuyenxe(tuyenXe.getTentuyenxe());
        dto.setKhoangcach(tuyenXe.getKhoangcach());
        dto.setSodiemdung(tuyenXe.getSodiemdung());
        return dto;
    }

    private TuyenXe convertToEntity(TuyenXeDTO dto) {
        TuyenXe tuyenXe = new TuyenXe();
        tuyenXe.setTentuyenxe(dto.getTentuyenxe());
        tuyenXe.setKhoangcach(dto.getKhoangcach());
        tuyenXe.setSodiemdung(dto.getSodiemdung());
        return tuyenXe;
    }
}
