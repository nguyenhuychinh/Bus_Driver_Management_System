package com.busdriver.service;

import com.busdriver.model.dto.DoanhThuDTO;
import com.busdriver.model.dto.DoanhThuDetailDTO;
import com.busdriver.model.entity.DoanhThu;
import com.busdriver.model.entity.LaiXe;
import com.busdriver.model.entity.PhanCong;
import com.busdriver.repository.DoanhThuRepository;
import com.busdriver.repository.LaiXeRepository;
import com.busdriver.repository.PhanCongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoanhThuService {

    @Autowired
    private DoanhThuRepository doanhThuRepository;

    @Autowired
    private PhanCongRepository phanCongRepository;

    @Autowired
    private LaiXeRepository laiXeRepository;

    private static final BigDecimal DON_GIA_1_LUOT = new BigDecimal("100000");
    private static final BigDecimal GIA_NHIEN_LIEU = new BigDecimal("23000");

    public List<DoanhThuDTO> getAll(String sortField, String sortDirection) {
        Sort sort;
        if (sortField != null && !sortField.isEmpty()) {
            Sort.Direction direction = "desc".equalsIgnoreCase(sortDirection) ? Sort.Direction.DESC : Sort.Direction.ASC;
            sort = Sort.by(direction, sortField);
        } else {
            // Default: sort by ngaylai DESC
            sort = Sort.by(Sort.Direction.DESC, "ngaylai");
        }
        
        return doanhThuRepository.findAll(sort).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public DoanhThuDTO getById(Long id) {
        DoanhThu doanhThu = doanhThuRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy doanh thu"));
        
        DoanhThuDTO dto = convertToDTO(doanhThu);
        return dto;
    }

    public DoanhThuDetailDTO getDetailById(Long id) {
        DoanhThu doanhThu = doanhThuRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy doanh thu"));
        
        DoanhThuDetailDTO dto = convertToDetailDTO(doanhThu);
        return dto;
    }

    public List<DoanhThuDTO> search(Long phanCongId, String ngay) {
        List<DoanhThu> results;
        
        if (phanCongId != null) {
            results = doanhThuRepository.findByPhancongId(phanCongId);
        } else if (ngay != null && !ngay.trim().isEmpty()) {
            LocalDate ngayDate;
            try {
                // Try yyyy-MM-dd first
                ngayDate = LocalDate.parse(ngay.trim());
            } catch (DateTimeParseException e) {
                try {
                    // Try dd/MM/yyyy
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                    ngayDate = LocalDate.parse(ngay.trim(), formatter);
                } catch (DateTimeParseException e2) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                        "Ngày không hợp lệ. Sử dụng định dạng YYYY-MM-DD hoặc DD/MM/YYYY");
                }
            }
            results = doanhThuRepository.findByNgaylai(ngayDate);
        } else {
            // Return all, sorted by ngaylai desc, then id desc
            Sort sort = Sort.by(Sort.Direction.DESC, "ngaylai")
                    .and(Sort.by(Sort.Direction.DESC, "id"));
            results = doanhThuRepository.findAll(sort);
        }
        
        // Convert to DTO and return
        return results.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public DoanhThuDTO create(DoanhThuDTO dto) {
        validate(dto);
        
        // Check UNIQUE constraint: (phanCongId, ngaylai)
        if (doanhThuRepository.findByPhancongIdAndNgaylai(dto.getPhancongId(), dto.getNgaylai()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, 
                "Đã tồn tại doanh thu cho phân công này trong ngày này");
        }
        
        // Get PhanCong to access soluotchay, nhienlieu, laixe
        PhanCong phanCong = phanCongRepository.findById(dto.getPhancongId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy phân công"));
        
        // Get LaiXe to access hesoluong
        if (phanCong.getLaixe() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phân công không có lái xe");
        }
        LaiXe laiXe = laiXeRepository.findById(phanCong.getLaixe().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy lái xe"));
        
        // Calculate luong = soluotchay * DON_GIA_1_LUOT * hesoluong
        Integer soluotchay = phanCong.getSoluotchay() != null ? phanCong.getSoluotchay() : 0;
        BigDecimal hesoluong = laiXe.getHesoluong() != null ? laiXe.getHesoluong() : BigDecimal.ONE;
        BigDecimal luong = BigDecimal.valueOf(soluotchay)
                .multiply(DON_GIA_1_LUOT)
                .multiply(hesoluong);
        
        // Calculate tiennhienlieu:
        // If dto has tiennhienlieu, use it
        // Else if phan_cong.nhienlieu != null, calculate = nhienlieu * GIA_NHIEN_LIEU
        // Else = 0
        BigDecimal tienNhienLieu;
        if (dto.getTiennhienlieu() != null && dto.getTiennhienlieu().compareTo(BigDecimal.ZERO) > 0) {
            tienNhienLieu = dto.getTiennhienlieu();
        } else if (phanCong.getNhienlieu() != null && phanCong.getNhienlieu().compareTo(BigDecimal.ZERO) > 0) {
            tienNhienLieu = phanCong.getNhienlieu().multiply(GIA_NHIEN_LIEU);
        } else {
            tienNhienLieu = BigDecimal.ZERO;
        }
        
        // Calculate doanhthu = tongtienve - (luong + tiennhienlieu)
        BigDecimal tongTienVe = dto.getTongtienve();
        BigDecimal doanhThuCalculated = tongTienVe.subtract(luong.add(tienNhienLieu));
        if (doanhThuCalculated.compareTo(BigDecimal.ZERO) < 0) {
            doanhThuCalculated = BigDecimal.ZERO;
        }
        
        // Create entity
        DoanhThu doanhThu = new DoanhThu();
        doanhThu.setPhancong(phanCong);
        doanhThu.setNgaylai(dto.getNgaylai());
        doanhThu.setNhienlieu(phanCong.getNhienlieu()); // Store nhienlieu from phan_cong for reference
        doanhThu.setTiennhienlieu(tienNhienLieu);
        doanhThu.setLuong(luong);
        doanhThu.setSohanhkhach(dto.getSohanhkhach()); // Optional field
        doanhThu.setTongtienve(tongTienVe);
        doanhThu.setDoanhthu(doanhThuCalculated);
        
        DoanhThu saved = doanhThuRepository.save(doanhThu);
        return convertToDTO(saved);
    }

    public DoanhThuDTO update(Long id, DoanhThuDTO dto) {
        DoanhThu doanhThu = doanhThuRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy doanh thu"));

        // Validate (but don't update phancongId - keep existing)
        if (dto.getTongtienve() != null && dto.getTongtienve().compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tổng tiền vé phải >= 0");
        }
        if (dto.getLuong() != null && dto.getLuong().compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Lương phải >= 0");
        }
        if (dto.getTiennhienlieu() != null && dto.getTiennhienlieu().compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tiền nhiên liệu phải >= 0");
        }

        // Update fields (except phancongId)
        if (dto.getNgaylai() != null) {
            doanhThu.setNgaylai(dto.getNgaylai());
        }
        if (dto.getNhienlieu() != null) {
            doanhThu.setNhienlieu(dto.getNhienlieu());
        }
        if (dto.getTiennhienlieu() != null) {
            doanhThu.setTiennhienlieu(dto.getTiennhienlieu());
        }
        if (dto.getLuong() != null) {
            doanhThu.setLuong(dto.getLuong());
        }
        if (dto.getSohanhkhach() != null) {
            doanhThu.setSohanhkhach(dto.getSohanhkhach());
        }
        if (dto.getTongtienve() != null) {
            doanhThu.setTongtienve(dto.getTongtienve());
        }

        // Recalculate doanhthu = tongtienve - (luong + tiennhienlieu)
        BigDecimal tongTienVe = doanhThu.getTongtienve() != null ? doanhThu.getTongtienve() : BigDecimal.ZERO;
        BigDecimal luong = doanhThu.getLuong() != null ? doanhThu.getLuong() : BigDecimal.ZERO;
        BigDecimal tienNhienLieu = doanhThu.getTiennhienlieu() != null ? doanhThu.getTiennhienlieu() : BigDecimal.ZERO;
        
        BigDecimal doanhThuCalculated = tongTienVe.subtract(luong.add(tienNhienLieu));
        if (doanhThuCalculated.compareTo(BigDecimal.ZERO) < 0) {
            doanhThuCalculated = BigDecimal.ZERO;
        }
        doanhThu.setDoanhthu(doanhThuCalculated);

        DoanhThu updated = doanhThuRepository.save(doanhThu);
        return convertToDTO(updated);
    }

    public void delete(Long id) {
        if (!doanhThuRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy doanh thu");
        }
        doanhThuRepository.deleteById(id);
    }

    private void validate(DoanhThuDTO dto) {
        if (dto.getPhancongId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phân công là bắt buộc");
        }
        
        PhanCong phanCong = phanCongRepository.findById(dto.getPhancongId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy phân công"));

        if (dto.getNgaylai() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ngày lái là bắt buộc");
        }

        if (dto.getTongtienve() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tổng tiền vé là bắt buộc");
        }
        
        if (dto.getTongtienve().compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tổng tiền vé phải >= 0");
        }

        if (dto.getLuong() != null && dto.getLuong().compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Lương phải >= 0");
        }

        if (dto.getTiennhienlieu() != null && dto.getTiennhienlieu().compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tiền nhiên liệu phải >= 0");
        }
    }

    private DoanhThuDTO convertToDTO(DoanhThu doanhThu) {
        DoanhThuDTO dto = new DoanhThuDTO();
        dto.setId(doanhThu.getId());
        if (doanhThu.getPhancong() != null) {
            dto.setPhancongId(doanhThu.getPhancong().getId());
        }
        dto.setNgaylai(doanhThu.getNgaylai());
        dto.setNhienlieu(doanhThu.getNhienlieu());
        dto.setTiennhienlieu(doanhThu.getTiennhienlieu());
        dto.setLuong(doanhThu.getLuong());
        dto.setSohanhkhach(doanhThu.getSohanhkhach());
        dto.setTongtienve(doanhThu.getTongtienve());
        dto.setDoanhthu(doanhThu.getDoanhthu());
        return dto;
    }

    private DoanhThuDetailDTO convertToDetailDTO(DoanhThu doanhThu) {
        DoanhThuDetailDTO dto = new DoanhThuDetailDTO();
        dto.setId(doanhThu.getId());
        if (doanhThu.getPhancong() != null) {
            dto.setPhancongId(doanhThu.getPhancong().getId());
            dto.setPhanCongNgay(doanhThu.getPhancong().getNgay());
            
            // Get lai xe info
            if (doanhThu.getPhancong().getLaixe() != null) {
                dto.setLaiXeHoten(doanhThu.getPhancong().getLaixe().getHoten());
            }
            
            // Get tuyen xe info
            if (doanhThu.getPhancong().getTuyenxe() != null) {
                dto.setTuyenXeTen(doanhThu.getPhancong().getTuyenxe().getTentuyenxe());
            }
        }
        dto.setNgaylai(doanhThu.getNgaylai());
        // nhienlieu is BigDecimal in entity, convert to String for DTO
        dto.setNhienlieu(doanhThu.getNhienlieu() != null ? doanhThu.getNhienlieu().toString() : null);
        dto.setTiennhienlieu(doanhThu.getTiennhienlieu());
        dto.setLuong(doanhThu.getLuong());
        dto.setSohanhkhach(doanhThu.getSohanhkhach());
        dto.setTongtienve(doanhThu.getTongtienve());
        dto.setDoanhthu(doanhThu.getDoanhthu());
        return dto;
    }

    // Note: convertToEntity is no longer used in create() method
    // Keeping it for potential future use, but create() now builds entity directly
    private DoanhThu convertToEntity(DoanhThuDTO dto) {
        DoanhThu doanhThu = new DoanhThu();

        PhanCong phanCong = phanCongRepository.findById(dto.getPhancongId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy phân công"));

        doanhThu.setPhancong(phanCong);
        doanhThu.setNgaylai(dto.getNgaylai());
        doanhThu.setNhienlieu(dto.getNhienlieu());
        doanhThu.setTiennhienlieu(dto.getTiennhienlieu());
        doanhThu.setLuong(dto.getLuong());
        doanhThu.setSohanhkhach(dto.getSohanhkhach());
        doanhThu.setTongtienve(dto.getTongtienve());
        // doanhthu will be calculated in create/update method
        return doanhThu;
    }
}
