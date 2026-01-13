package com.busdriver.model.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "tuyen_xe")
public class TuyenXe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tentuyenxe")
    private String tentuyenxe;

    @Column(name = "khoangcach")
    private BigDecimal khoangcach;

    @Column(name = "sodiemdung")
    private Integer sodiemdung;

    public TuyenXe() {
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
