package com.busdriver.model.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class LuongCalcDTO {
    private Long laixeId;
    private String hoten;
    private BigDecimal hesoluong;
    private LocalDate from;
    private LocalDate to;
    private Integer tongLuot;
    private BigDecimal donGia;
    private BigDecimal luongPhaiTra;
    private BigDecimal luongDaTra;
    private BigDecimal luongConNo;

    public LuongCalcDTO() {
    }

    public Long getLaixeId() {
        return laixeId;
    }

    public void setLaixeId(Long laixeId) {
        this.laixeId = laixeId;
    }

    public String getHoten() {
        return hoten;
    }

    public void setHoten(String hoten) {
        this.hoten = hoten;
    }

    public BigDecimal getHesoluong() {
        return hesoluong;
    }

    public void setHesoluong(BigDecimal hesoluong) {
        this.hesoluong = hesoluong;
    }

    public LocalDate getFrom() {
        return from;
    }

    public void setFrom(LocalDate from) {
        this.from = from;
    }

    public LocalDate getTo() {
        return to;
    }

    public void setTo(LocalDate to) {
        this.to = to;
    }

    public Integer getTongLuot() {
        return tongLuot;
    }

    public void setTongLuot(Integer tongLuot) {
        this.tongLuot = tongLuot;
    }

    public BigDecimal getDonGia() {
        return donGia;
    }

    public void setDonGia(BigDecimal donGia) {
        this.donGia = donGia;
    }

    public BigDecimal getLuongPhaiTra() {
        return luongPhaiTra;
    }

    public void setLuongPhaiTra(BigDecimal luongPhaiTra) {
        this.luongPhaiTra = luongPhaiTra;
    }

    public BigDecimal getLuongDaTra() {
        return luongDaTra;
    }

    public void setLuongDaTra(BigDecimal luongDaTra) {
        this.luongDaTra = luongDaTra;
    }

    public BigDecimal getLuongConNo() {
        return luongConNo;
    }

    public void setLuongConNo(BigDecimal luongConNo) {
        this.luongConNo = luongConNo;
    }
}
