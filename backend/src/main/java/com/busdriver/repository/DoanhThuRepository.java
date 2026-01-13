package com.busdriver.repository;

import com.busdriver.model.entity.DoanhThu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DoanhThuRepository extends JpaRepository<DoanhThu, Long> {
    Optional<DoanhThu> findByPhancongIdAndNgaylai(Long phancongId, LocalDate ngaylai);
    List<DoanhThu> findByPhancongId(Long phancongId);
    List<DoanhThu> findByNgaylai(LocalDate ngaylai);
}
