package com.busdriver.model.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "doanh_thu")
public class DoanhThu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = jakarta.persistence.FetchType.EAGER)
    @JoinColumn(name = "phan_cong_id")
    private PhanCong phancong;

    @Column(name = "ngaylai", nullable = false)
    private LocalDate ngaylai;

    @Column(name = "nhienlieu", precision = 10, scale = 2)
    private BigDecimal nhienlieu;

    @Column(name = "tiennhienlieu", nullable = false, precision = 12, scale = 2)
    private BigDecimal tiennhienlieu;

    @Column(name = "luong", nullable = false, precision = 12, scale = 2)
    private BigDecimal luong;

    @Column(name = "sohanhkhach")
    private Integer sohanhkhach;

    @Column(name = "tongtienve", nullable = false, precision = 12, scale = 2)
    private BigDecimal tongtienve;

    @Column(name = "doanhthu", nullable = false, precision = 12, scale = 2)
    private BigDecimal doanhthu;

    public DoanhThu() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PhanCong getPhancong() {
        return phancong;
    }

    public void setPhancong(PhanCong phancong) {
        this.phancong = phancong;
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
