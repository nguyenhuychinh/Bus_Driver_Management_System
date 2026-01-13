package com.busdriver.service;

import com.busdriver.model.dto.ThongKeDTO;
import com.busdriver.model.entity.DoanhThu;
import com.busdriver.model.entity.LaiXe;
import com.busdriver.repository.DoanhThuRepository;
import com.busdriver.repository.LaiXeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ThongKeService {

    @Autowired
    private DoanhThuRepository doanhThuRepository;

    @Autowired
    private LaiXeRepository laiXeRepository;

    public Map<LocalDate, BigDecimal> getDailyRevenue(LocalDate startDate, LocalDate endDate) {
        List<DoanhThu> doanhThuList = doanhThuRepository.findAll();

        return doanhThuList.stream()
                .filter(dt -> dt.getNgaylai() != null &&
                        !dt.getNgaylai().isBefore(startDate) &&
                        !dt.getNgaylai().isAfter(endDate))
                .collect(Collectors.groupingBy(
                        DoanhThu::getNgaylai,
                        Collectors.reducing(
                                BigDecimal.ZERO,
                                DoanhThu::getDoanhthu,
                                BigDecimal::add
                        )
                ));
    }

    public Map<YearMonth, BigDecimal> getMonthlyRevenue(int year) {
        List<DoanhThu> doanhThuList = doanhThuRepository.findAll();

        return doanhThuList.stream()
                .filter(dt -> dt.getNgaylai() != null && dt.getNgaylai().getYear() == year)
                .collect(Collectors.groupingBy(
                        dt -> YearMonth.from(dt.getNgaylai()),
                        Collectors.reducing(
                                BigDecimal.ZERO,
                                DoanhThu::getDoanhthu,
                                BigDecimal::add
                        )
                ));
    }

    public List<ThongKeDTO> getTopDrivers(int limit) {
        List<LaiXe> drivers = laiXeRepository.findAll();

        return drivers.stream()
                .sorted((d1, d2) -> {
                    BigDecimal revenue1 = d1.getLuongdatra() != null ? d1.getLuongdatra() : BigDecimal.ZERO;
                    BigDecimal revenue2 = d2.getLuongdatra() != null ? d2.getLuongdatra() : BigDecimal.ZERO;
                    return revenue2.compareTo(revenue1);
                })
                .limit(limit)
                .map(this::convertToThongKeDTO)
                .collect(Collectors.toList());
    }

    public BigDecimal getTotalRevenue() {
        List<DoanhThu> doanhThuList = doanhThuRepository.findAll();

        return doanhThuList.stream()
                .map(DoanhThu::getDoanhthu)
                .filter(d -> d != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal getTotalSalaryPaid() {
        List<LaiXe> drivers = laiXeRepository.findAll();

        return drivers.stream()
                .map(LaiXe::getLuongdatra)
                .filter(d -> d != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public long getTotalTrips() {
        return doanhThuRepository.findAll().size();
    }

    public long getTotalDrivers() {
        return laiXeRepository.findAll().size();
    }

    private ThongKeDTO convertToThongKeDTO(LaiXe laiXe) {
        ThongKeDTO dto = new ThongKeDTO();
        dto.setId(laiXe.getId());
        dto.setHoten(laiXe.getHoten());
        dto.setLuongdatra(laiXe.getLuongdatra());
        dto.setTongsotuyenlai(laiXe.getTongsotuyenlai());
        return dto;
    }
}
