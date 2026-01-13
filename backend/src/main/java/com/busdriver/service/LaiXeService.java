package com.busdriver.service;

import com.busdriver.model.dto.LaiXeDTO;
import com.busdriver.model.entity.LaiXe;
import com.busdriver.repository.LaiXeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LaiXeService {

    @Autowired
    private LaiXeRepository laiXeRepository;

    public List<LaiXeDTO> getAll() {
        return laiXeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public LaiXeDTO getById(Long id) {
        LaiXe laiXe = laiXeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("LaiXe not found"));
        return convertToDTO(laiXe);
    }

    public LaiXeDTO create(LaiXeDTO dto) {
        validate(dto);
        LaiXe laiXe = convertToEntity(dto);
        LaiXe saved = laiXeRepository.save(laiXe);
        return convertToDTO(saved);
    }

    public LaiXeDTO update(Long id, LaiXeDTO dto) {
        LaiXe laiXe = laiXeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy lái xe"));

        // Validate cccd uniqueness (only if cccd is changed)
        if (dto.getCccd() != null && !dto.getCccd().equals(laiXe.getCccd())) {
            if (!dto.getCccd().matches("^\\d{12}$")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "CCCD phải đủ 12 chữ số");
            }
            if (laiXeRepository.existsByCccd(dto.getCccd())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "CCCD đã tồn tại");
            }
        }

        if (dto.getHoten() == null || dto.getHoten().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Họ tên là bắt buộc");
        }

        if (dto.getSodienthoai() != null && !dto.getSodienthoai().matches("\\d+")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số điện thoại phải là số");
        }

        if (dto.getHesoluong() != null && dto.getHesoluong().compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Hệ số lương phải >= 0");
        }

        laiXe.setHoten(dto.getHoten());
        laiXe.setDiachi(dto.getDiachi());
        laiXe.setTrinhdo(dto.getTrinhdo());
        laiXe.setSodienthoai(dto.getSodienthoai());
        laiXe.setHesoluong(dto.getHesoluong());
        laiXe.setCccd(dto.getCccd());
        laiXe.setTongsotuyenlai(dto.getTongsotuyenlai());
        laiXe.setLuongphaitra(dto.getLuongphaitra());
        laiXe.setLuongdatra(dto.getLuongdatra());
        laiXe.setLuongconno(dto.getLuongconno());

        try {
            LaiXe updated = laiXeRepository.save(laiXe);
            return convertToDTO(updated);
        } catch (DataIntegrityViolationException e) {
            if (e.getMessage() != null && e.getMessage().contains("uk_lai_xe_cccd")) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "CCCD đã tồn tại");
            }
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dữ liệu không hợp lệ");
        }
    }

    public void delete(Long id) {
        if (!laiXeRepository.existsById(id)) {
            throw new RuntimeException("LaiXe not found");
        }
        laiXeRepository.deleteById(id);
    }

    private void validate(LaiXeDTO dto) {
        if (dto.getHoten() == null || dto.getHoten().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Họ tên là bắt buộc");
        }

        if (dto.getCccd() == null || dto.getCccd().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "CCCD là bắt buộc");
        }

        if (!dto.getCccd().matches("^\\d{12}$")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "CCCD phải đủ 12 chữ số");
        }

        if (laiXeRepository.existsByCccd(dto.getCccd())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "CCCD đã tồn tại");
        }

        if (dto.getSodienthoai() != null && !dto.getSodienthoai().matches("\\d+")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số điện thoại phải là số");
        }

        if (dto.getHesoluong() != null && dto.getHesoluong().compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Hệ số lương phải >= 0");
        }
    }

    private LaiXeDTO convertToDTO(LaiXe laiXe) {
        LaiXeDTO dto = new LaiXeDTO();
        dto.setId(laiXe.getId());
        dto.setHoten(laiXe.getHoten());
        dto.setDiachi(laiXe.getDiachi());
        dto.setTrinhdo(laiXe.getTrinhdo());
        dto.setSodienthoai(laiXe.getSodienthoai());
        dto.setHesoluong(laiXe.getHesoluong());
        dto.setCccd(laiXe.getCccd());
        dto.setTongsotuyenlai(laiXe.getTongsotuyenlai());
        dto.setLuongphaitra(laiXe.getLuongphaitra());
        dto.setLuongdatra(laiXe.getLuongdatra());
        dto.setLuongconno(laiXe.getLuongconno());
        return dto;
    }

    private LaiXe convertToEntity(LaiXeDTO dto) {
        LaiXe laiXe = new LaiXe();
        laiXe.setHoten(dto.getHoten());
        laiXe.setDiachi(dto.getDiachi());
        laiXe.setTrinhdo(dto.getTrinhdo());
        laiXe.setSodienthoai(dto.getSodienthoai());
        laiXe.setHesoluong(dto.getHesoluong());
        laiXe.setCccd(dto.getCccd());
        laiXe.setTongsotuyenlai(dto.getTongsotuyenlai());
        laiXe.setLuongphaitra(dto.getLuongphaitra());
        laiXe.setLuongdatra(dto.getLuongdatra());
        laiXe.setLuongconno(dto.getLuongconno());
        return laiXe;
    }
}
