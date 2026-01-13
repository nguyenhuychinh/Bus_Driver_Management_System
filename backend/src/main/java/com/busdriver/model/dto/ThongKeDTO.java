package com.busdriver.model.dto;

import java.math.BigDecimal;

public class ThongKeDTO {
    private Long id;
    private String hoten;
    private BigDecimal luongdatra;
    private Integer tongsotuyenlai;

    public ThongKeDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getHoten() {
        return hoten;
    }

    public void setHoten(String hoten) {
        this.hoten = hoten;
    }

    public BigDecimal getLuongdatra() {
        return luongdatra;
    }

    public void setLuongdatra(BigDecimal luongdatra) {
        this.luongdatra = luongdatra;
    }

    public Integer getTongsotuyenlai() {
        return tongsotuyenlai;
    }

    public void setTongsotuyenlai(Integer tongsotuyenlai) {
        this.tongsotuyenlai = tongsotuyenlai;
    }
}
