package com.busdriver.repository;

import com.busdriver.model.entity.TuyenXe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TuyenXeRepository extends JpaRepository<TuyenXe, Long> {
    List<TuyenXe> findByTentuyenxeContainingIgnoreCase(String tentuyenxe);
}
