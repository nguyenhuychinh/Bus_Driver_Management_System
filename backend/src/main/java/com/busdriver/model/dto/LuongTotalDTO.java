package com.busdriver.model.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class LuongTotalDTO {
    private LocalDate from;
    private LocalDate to;
    private BigDecimal tongLuongPhaiTra;
    private BigDecimal tongLuongDaTra;
    private BigDecimal tongLuongConNo;

    public LuongTotalDTO() {
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

    public BigDecimal getTongLuongPhaiTra() {
        return tongLuongPhaiTra;
    }

    public void setTongLuongPhaiTra(BigDecimal tongLuongPhaiTra) {
        this.tongLuongPhaiTra = tongLuongPhaiTra;
    }

    public BigDecimal getTongLuongDaTra() {
        return tongLuongDaTra;
    }

    public void setTongLuongDaTra(BigDecimal tongLuongDaTra) {
        this.tongLuongDaTra = tongLuongDaTra;
    }

    public BigDecimal getTongLuongConNo() {
        return tongLuongConNo;
    }

    public void setTongLuongConNo(BigDecimal tongLuongConNo) {
        this.tongLuongConNo = tongLuongConNo;
    }
}
