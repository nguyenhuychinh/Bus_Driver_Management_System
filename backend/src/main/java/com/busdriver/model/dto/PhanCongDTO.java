package com.busdriver.model.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PhanCongDTO {
    private Long id;
    private Long laixeId;
    private Long tuyenxeId;
    private LocalDate ngay;
    private Integer soluotchay;
    private BigDecimal nhienlieu;

    public PhanCongDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getLaixeId() {
        return laixeId;
    }

    public void setLaixeId(Long laixeId) {
        this.laixeId = laixeId;
    }

    public Long getTuyenxeId() {
        return tuyenxeId;
    }

    public void setTuyenxeId(Long tuyenxeId) {
        this.tuyenxeId = tuyenxeId;
    }

    public LocalDate getNgay() {
        return ngay;
    }

    public void setNgay(LocalDate ngay) {
        this.ngay = ngay;
    }

    public Integer getSoluotchay() {
        return soluotchay;
    }

    public void setSoluotchay(Integer soluotchay) {
        this.soluotchay = soluotchay;
    }

    public BigDecimal getNhienlieu() {
        return nhienlieu;
    }

    public void setNhienlieu(BigDecimal nhienlieu) {
        this.nhienlieu = nhienlieu;
    }
}
