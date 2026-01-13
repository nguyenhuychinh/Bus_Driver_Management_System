package com.busdriver.model.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "phan_cong")
public class PhanCong {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = jakarta.persistence.FetchType.EAGER)
    @JoinColumn(name = "laixe_id")
    private LaiXe laixe;

    @ManyToOne(fetch = jakarta.persistence.FetchType.EAGER)
    @JoinColumn(name = "tuyen_xe_id")
    private TuyenXe tuyenxe;

    @Column(name = "ngay")
    private LocalDate ngay;

    @Column(name = "soluotchay")
    private Integer soluotchay;

    @Column(name = "nhienlieu")
    private BigDecimal nhienlieu;

    public PhanCong() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LaiXe getLaixe() {
        return laixe;
    }

    public void setLaixe(LaiXe laixe) {
        this.laixe = laixe;
    }

    public TuyenXe getTuyenxe() {
        return tuyenxe;
    }

    public void setTuyenxe(TuyenXe tuyenxe) {
        this.tuyenxe = tuyenxe;
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
