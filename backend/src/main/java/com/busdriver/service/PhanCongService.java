package com.busdriver.service;

import com.busdriver.model.dto.PhanCongDTO;
import com.busdriver.model.entity.PhanCong;
import com.busdriver.model.entity.LaiXe;
import com.busdriver.model.entity.TuyenXe;
import com.busdriver.repository.PhanCongRepository;
import com.busdriver.repository.LaiXeRepository;
import com.busdriver.repository.TuyenXeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PhanCongService {

    @Autowired
    private PhanCongRepository phanCongRepository;

    @Autowired
    private LaiXeRepository laiXeRepository;

    @Autowired
    private TuyenXeRepository tuyenXeRepository;

    public List<PhanCongDTO> getAll() {
        return phanCongRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public PhanCongDTO getById(Long id) {
        PhanCong phanCong = phanCongRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy phân công"));
        return convertToDTO(phanCong);
    }

    public PhanCongDTO create(PhanCongDTO dto) {
        validate(dto);
        
        // Check UNIQUE constraint (laixeId, tuyenxeId, ngay)
        Optional<PhanCong> existing = phanCongRepository.findByLaixeIdAndTuyenxeIdAndNgay(
            dto.getLaixeId(), dto.getTuyenxeId(), dto.getNgay());
        if (existing.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Phân công đã tồn tại (trùng lái xe + tuyến xe + ngày)");
        }
        
        try {
            PhanCong phanCong = convertToEntity(dto);
            PhanCong saved = phanCongRepository.save(phanCong);
            return convertToDTO(saved);
        } catch (DataIntegrityViolationException e) {
            if (e.getMessage() != null && e.getMessage().contains("uk_phan_cong")) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Phân công đã tồn tại (trùng lái xe + tuyến xe + ngày)");
            }
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dữ liệu không hợp lệ");
        }
    }

    public PhanCongDTO update(Long id, PhanCongDTO dto) {
        PhanCong phanCong = phanCongRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy phân công"));
        
        validate(dto);
        
        // Check UNIQUE constraint only if the combination changed
        if (!phanCong.getLaixe().getId().equals(dto.getLaixeId()) 
            || !phanCong.getTuyenxe().getId().equals(dto.getTuyenxeId())
            || !phanCong.getNgay().equals(dto.getNgay())) {
            Optional<PhanCong> existing = phanCongRepository.findByLaixeIdAndTuyenxeIdAndNgay(
                dto.getLaixeId(), dto.getTuyenxeId(), dto.getNgay());
            if (existing.isPresent() && !existing.get().getId().equals(id)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Phân công đã tồn tại (trùng lái xe + tuyến xe + ngày)");
            }
        }

        LaiXe laiXe = laiXeRepository.findById(dto.getLaixeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy lái xe"));
        TuyenXe tuyenXe = tuyenXeRepository.findById(dto.getTuyenxeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tuyến xe"));

        phanCong.setLaixe(laiXe);
        phanCong.setTuyenxe(tuyenXe);
        phanCong.setNgay(dto.getNgay());
        phanCong.setSoluotchay(dto.getSoluotchay());
        phanCong.setNhienlieu(dto.getNhienlieu());

        try {
            PhanCong updated = phanCongRepository.save(phanCong);
            return convertToDTO(updated);
        } catch (DataIntegrityViolationException e) {
            if (e.getMessage() != null && e.getMessage().contains("uk_phan_cong")) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Phân công đã tồn tại (trùng lái xe + tuyến xe + ngày)");
            }
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dữ liệu không hợp lệ");
        }
    }

    public void delete(Long id) {
        if (!phanCongRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy phân công");
        }
        phanCongRepository.deleteById(id);
    }

    public List<PhanCongDTO> getByLaixeId(Long laixeId) {
        return phanCongRepository.findByLaixeId(laixeId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private void validate(PhanCongDTO dto) {
        if (dto.getLaixeId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Lái xe là bắt buộc");
        }
        
        if (dto.getTuyenxeId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tuyến xe là bắt buộc");
        }
        
        if (dto.getNgay() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ngày là bắt buộc");
        }
        
        LaiXe laiXe = laiXeRepository.findById(dto.getLaixeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy lái xe"));

        TuyenXe tuyenXe = tuyenXeRepository.findById(dto.getTuyenxeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tuyến xe"));
        
        if (dto.getSoluotchay() != null && dto.getSoluotchay() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số lượt chạy phải >= 0");
        }
        
        if (dto.getNhienlieu() != null && dto.getNhienlieu().compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nhiên liệu phải >= 0");
        }
    }

    private PhanCongDTO convertToDTO(PhanCong phanCong) {
        PhanCongDTO dto = new PhanCongDTO();
        dto.setId(phanCong.getId());
        dto.setLaixeId(phanCong.getLaixe().getId());
        dto.setTuyenxeId(phanCong.getTuyenxe().getId());
        dto.setNgay(phanCong.getNgay());
        dto.setSoluotchay(phanCong.getSoluotchay());
        dto.setNhienlieu(phanCong.getNhienlieu());
        return dto;
    }

    private PhanCong convertToEntity(PhanCongDTO dto) {
        PhanCong phanCong = new PhanCong();

        LaiXe laiXe = laiXeRepository.findById(dto.getLaixeId())
                .orElseThrow(() -> new RuntimeException("LaiXe not found"));
        TuyenXe tuyenXe = tuyenXeRepository.findById(dto.getTuyenxeId())
                .orElseThrow(() -> new RuntimeException("TuyenXe not found"));

        phanCong.setLaixe(laiXe);
        phanCong.setTuyenxe(tuyenXe);
        phanCong.setNgay(dto.getNgay());
        phanCong.setSoluotchay(dto.getSoluotchay());
        phanCong.setNhienlieu(dto.getNhienlieu());
        return phanCong;
    }
}
