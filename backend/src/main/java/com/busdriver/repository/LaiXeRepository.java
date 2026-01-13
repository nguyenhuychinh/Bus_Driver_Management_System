package com.busdriver.repository;

import com.busdriver.model.entity.LaiXe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LaiXeRepository extends JpaRepository<LaiXe, Long> {
    List<LaiXe> findByHotenContainingIgnoreCase(String hoten);
    boolean existsByCccd(String cccd);
}
