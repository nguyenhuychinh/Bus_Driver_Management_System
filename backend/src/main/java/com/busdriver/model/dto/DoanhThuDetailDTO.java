package com.busdriver.model.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class DoanhThuDetailDTO {
    private Long id;
    private Long phancongId;
    private LocalDate ngaylai;
    private String nhienlieu;
    private BigDecimal tiennhienlieu;
    private BigDecimal luong;
    private Integer sohanhkhach;
    private BigDecimal tongtienve;
    private BigDecimal doanhthu;
    
    // Joined data from PhanCong
    private String laiXeHoten;
    private String tuyenXeTen;
    private LocalDate phanCongNgay;

    public DoanhThuDetailDTO() {
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

    public String getNhienlieu() {
        return nhienlieu;
    }

    public void setNhienlieu(String nhienlieu) {
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

    public String getLaiXeHoten() {
        return laiXeHoten;
    }

    public void setLaiXeHoten(String laiXeHoten) {
        this.laiXeHoten = laiXeHoten;
    }

    public String getTuyenXeTen() {
        return tuyenXeTen;
    }

    public void setTuyenXeTen(String tuyenXeTen) {
        this.tuyenXeTen = tuyenXeTen;
    }

    public LocalDate getPhanCongNgay() {
        return phanCongNgay;
    }

    public void setPhanCongNgay(LocalDate phanCongNgay) {
        this.phanCongNgay = phanCongNgay;
    }
}
