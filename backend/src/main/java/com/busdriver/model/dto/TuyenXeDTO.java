package com.busdriver.model.dto;

import java.math.BigDecimal;

public class TuyenXeDTO {
    private Long id;
    private String tentuyenxe;
    private BigDecimal khoangcach;
    private Integer sodiemdung;

    public TuyenXeDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTentuyenxe() {
        return tentuyenxe;
    }

    public void setTentuyenxe(String tentuyenxe) {
        this.tentuyenxe = tentuyenxe;
    }

    public BigDecimal getKhoangcach() {
        return khoangcach;
    }

    public void setKhoangcach(BigDecimal khoangcach) {
        this.khoangcach = khoangcach;
    }

    public Integer getSodiemdung() {
        return sodiemdung;
    }

    public void setSodiemdung(Integer sodiemdung) {
        this.sodiemdung = sodiemdung;
    }
}
