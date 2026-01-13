package com.busdriver.model.dto;

import java.math.BigDecimal;

public class LuongPayDTO {
    private Long laixeId;
    private BigDecimal soTienThanhToan;
    private BigDecimal luongPhaiTra;
    private BigDecimal luongDaTra;
    private BigDecimal luongConNo;

    public LuongPayDTO() {
    }

    public Long getLaixeId() {
        return laixeId;
    }

    public void setLaixeId(Long laixeId) {
        this.laixeId = laixeId;
    }

    public BigDecimal getSoTienThanhToan() {
        return soTienThanhToan;
    }

    public void setSoTienThanhToan(BigDecimal soTienThanhToan) {
        this.soTienThanhToan = soTienThanhToan;
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
