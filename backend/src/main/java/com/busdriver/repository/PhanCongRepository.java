package com.busdriver.repository;

import com.busdriver.model.entity.PhanCong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PhanCongRepository extends JpaRepository<PhanCong, Long> {
    List<PhanCong> findByLaixeId(Long laixeId);
    Optional<PhanCong> findByLaixeIdAndTuyenxeIdAndNgay(Long laixeId, Long tuyenxeId, LocalDate ngay);
    List<PhanCong> findByLaixeIdAndNgayBetween(Long laixeId, LocalDate from, LocalDate to);
    List<PhanCong> findByNgayBetween(LocalDate from, LocalDate to);
}
