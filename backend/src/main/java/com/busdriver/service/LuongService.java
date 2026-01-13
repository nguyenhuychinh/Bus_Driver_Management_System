package com.busdriver.service;

import com.busdriver.model.dto.LuongCalcDTO;
import com.busdriver.model.dto.LuongPayDTO;
import com.busdriver.model.dto.LuongTotalDTO;
import com.busdriver.model.entity.LaiXe;
import com.busdriver.model.entity.PhanCong;
import com.busdriver.repository.LaiXeRepository;
import com.busdriver.repository.PhanCongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class LuongService {

    @Autowired
    private LaiXeRepository laiXeRepository;

    @Autowired
    private PhanCongRepository phanCongRepository;

    private static final BigDecimal DON_GIA_1_LUOT = new BigDecimal("100000");

    public LuongCalcDTO calculateSalary(Long laixeId, LocalDate from, LocalDate to) {
        LaiXe laiXe = laiXeRepository.findById(laixeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy lái xe"));

        // Set default dates if null
        if (from == null) {
            from = LocalDate.now().withDayOfMonth(1); // First day of current month
        }
        if (to == null) {
            to = LocalDate.now(); // Today
        }

        // Query phan_cong trong khoảng ngày
        List<PhanCong> phanCongList = phanCongRepository.findByLaixeIdAndNgayBetween(laixeId, from, to);
        
        // Tính tổng lượt
        Integer tongLuot = phanCongList.stream()
                .mapToInt(pc -> pc.getSoluotchay() != null ? pc.getSoluotchay() : 0)
                .sum();

        // Tính lương phải trả = tongLuot * DON_GIA_1_LUOT * hesoluong
        BigDecimal hesoluong = laiXe.getHesoluong() != null ? laiXe.getHesoluong() : BigDecimal.ONE;
        BigDecimal luongPhaiTra = BigDecimal.valueOf(tongLuot)
                .multiply(DON_GIA_1_LUOT)
                .multiply(hesoluong);

        // Lấy giá trị hiện tại
        BigDecimal luongDaTra = laiXe.getLuongdatra() != null ? laiXe.getLuongdatra() : BigDecimal.ZERO;
        BigDecimal luongConNo = luongPhaiTra.subtract(luongDaTra);
        if (luongConNo.compareTo(BigDecimal.ZERO) < 0) {
            luongConNo = BigDecimal.ZERO;
        }

        // UPDATE vào lai_xe
        laiXe.setLuongphaitra(luongPhaiTra);
        laiXe.setLuongconno(luongConNo);
        laiXeRepository.save(laiXe);

        // Tạo DTO response
        LuongCalcDTO dto = new LuongCalcDTO();
        dto.setLaixeId(laiXe.getId());
        dto.setHoten(laiXe.getHoten());
        dto.setHesoluong(hesoluong);
        dto.setFrom(from);
        dto.setTo(to);
        dto.setTongLuot(tongLuot);
        dto.setDonGia(DON_GIA_1_LUOT);
        dto.setLuongPhaiTra(luongPhaiTra);
        dto.setLuongDaTra(luongDaTra);
        dto.setLuongConNo(luongConNo);

        return dto;
    }

    public LuongPayDTO paySalary(Long laixeId, BigDecimal soTienThanhToan) {
        if (soTienThanhToan == null || soTienThanhToan.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số tiền thanh toán phải > 0");
        }

        LaiXe laiXe = laiXeRepository.findById(laixeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy lái xe"));

        BigDecimal luongPhaiTra = laiXe.getLuongphaitra() != null ? laiXe.getLuongphaitra() : BigDecimal.ZERO;
        BigDecimal currentPaid = laiXe.getLuongdatra() != null ? laiXe.getLuongdatra() : BigDecimal.ZERO;
        BigDecimal newPaid = currentPaid.add(soTienThanhToan);

        // Validate: không cho luongdatra > luongphaitra
        if (newPaid.compareTo(luongPhaiTra) > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                "Số tiền thanh toán vượt quá lương phải trả. Lương phải trả: " + luongPhaiTra + ", Đã trả: " + currentPaid);
        }

        laiXe.setLuongdatra(newPaid);
        BigDecimal luongConNo = luongPhaiTra.subtract(newPaid);
        if (luongConNo.compareTo(BigDecimal.ZERO) < 0) {
            luongConNo = BigDecimal.ZERO;
        }
        laiXe.setLuongconno(luongConNo);
        laiXeRepository.save(laiXe);

        LuongPayDTO dto = new LuongPayDTO();
        dto.setLaixeId(laiXe.getId());
        dto.setSoTienThanhToan(soTienThanhToan);
        dto.setLuongPhaiTra(luongPhaiTra);
        dto.setLuongDaTra(newPaid);
        dto.setLuongConNo(luongConNo);

        return dto;
    }

    public LuongTotalDTO calculateTotal(LocalDate from, LocalDate to) {
        // Set default dates if null
        if (from == null) {
            from = LocalDate.now().withDayOfMonth(1);
        }
        if (to == null) {
            to = LocalDate.now();
        }

        // Query all phan_cong trong khoảng ngày
        List<PhanCong> phanCongList = phanCongRepository.findByNgayBetween(from, to);

        // Group by laixeId và tính tổng lượt
        Map<Long, Integer> tongLuotMap = phanCongList.stream()
                .collect(Collectors.groupingBy(
                    pc -> pc.getLaixe().getId(),
                    Collectors.summingInt(pc -> pc.getSoluotchay() != null ? pc.getSoluotchay() : 0)
                ));

        BigDecimal tongLuongPhaiTra = BigDecimal.ZERO;
        BigDecimal tongLuongDaTra = BigDecimal.ZERO;
        BigDecimal tongLuongConNo = BigDecimal.ZERO;

        // Tính lương cho từng lái xe
        for (Map.Entry<Long, Integer> entry : tongLuotMap.entrySet()) {
            Long laixeId = entry.getKey();
            Integer tongLuot = entry.getValue();

            LaiXe laiXe = laiXeRepository.findById(laixeId).orElse(null);
            if (laiXe == null) continue;

            BigDecimal hesoluong = laiXe.getHesoluong() != null ? laiXe.getHesoluong() : BigDecimal.ONE;
            BigDecimal luongPhaiTra = BigDecimal.valueOf(tongLuot)
                    .multiply(DON_GIA_1_LUOT)
                    .multiply(hesoluong);

            tongLuongPhaiTra = tongLuongPhaiTra.add(luongPhaiTra);

            BigDecimal luongDaTra = laiXe.getLuongdatra() != null ? laiXe.getLuongdatra() : BigDecimal.ZERO;
            tongLuongDaTra = tongLuongDaTra.add(luongDaTra);

            BigDecimal luongConNo = luongPhaiTra.subtract(luongDaTra);
            if (luongConNo.compareTo(BigDecimal.ZERO) < 0) {
                luongConNo = BigDecimal.ZERO;
            }
            tongLuongConNo = tongLuongConNo.add(luongConNo);
        }

        LuongTotalDTO dto = new LuongTotalDTO();
        dto.setFrom(from);
        dto.setTo(to);
        dto.setTongLuongPhaiTra(tongLuongPhaiTra);
        dto.setTongLuongDaTra(tongLuongDaTra);
        dto.setTongLuongConNo(tongLuongConNo);

        return dto;
    }

    public void resetSalary(String mode) {
        if (mode == null || mode.isEmpty()) {
            mode = "RESET_PAID_ONLY";
        }

        List<LaiXe> allLaiXe = laiXeRepository.findAll();

        if ("RESET_ALL".equals(mode)) {
            // Reset tất cả: luongphaitra = 0, luongdatra = 0, luongconno = 0
            for (LaiXe laiXe : allLaiXe) {
                laiXe.setLuongphaitra(BigDecimal.ZERO);
                laiXe.setLuongdatra(BigDecimal.ZERO);
                laiXe.setLuongconno(BigDecimal.ZERO);
                laiXeRepository.save(laiXe);
            }
        } else {
            // RESET_PAID_ONLY: set luongdatra = 0, luongconno = luongphaitra
            for (LaiXe laiXe : allLaiXe) {
                BigDecimal luongPhaiTra = laiXe.getLuongphaitra() != null ? laiXe.getLuongphaitra() : BigDecimal.ZERO;
                laiXe.setLuongdatra(BigDecimal.ZERO);
                laiXe.setLuongconno(luongPhaiTra);
                laiXeRepository.save(laiXe);
            }
        }
    }
}
