package com.busdriver.model.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class DoanhThuDTO {
    private Long id;
    private Long phancongId;
    private LocalDate ngaylai;
    private BigDecimal nhienlieu;
    private BigDecimal tiennhienlieu;
    private BigDecimal luong;
    private Integer sohanhkhach;
    private BigDecimal tongtienve;
    private BigDecimal doanhthu;

    public DoanhThuDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPhancongId() {
        return phancongId;
    }

    public void setPhancongId(Long phancongId) {
        this.phancongId = phancongId;
    }

    public LocalDate getNgaylai() {
        return ngaylai;
    }

    public void setNgaylai(LocalDate ngaylai) {
        this.ngaylai = ngaylai;
    }

    public BigDecimal getNhienlieu() {
        return nhienlieu;
    }

    public void setNhienlieu(BigDecimal nhienlieu) {
        this.nhienlieu = nhienlieu;
    }

    public BigDecimal getTiennhienlieu() {
        return tiennhienlieu;
    }

    public void setTiennhienlieu(BigDecimal tiennhienlieu) {
        this.tiennhienlieu = tiennhienlieu;
    }

    public BigDecimal getLuong() {
        return luong;
    }

    public void setLuong(BigDecimal luong) {
        this.luong = luong;
    }

    public Integer getSohanhkhach() {
        return sohanhkhach;
    }

    public void setSohanhkhach(Integer sohanhkhach) {
        this.sohanhkhach = sohanhkhach;
    }

    public BigDecimal getTongtienve() {
        return tongtienve;
    }

    public void setTongtienve(BigDecimal tongtienve) {
        this.tongtienve = tongtienve;
    }

    public BigDecimal getDoanhthu() {
        return doanhthu;
    }

    public void setDoanhthu(BigDecimal doanhthu) {
        this.doanhthu = doanhthu;
    }
}
