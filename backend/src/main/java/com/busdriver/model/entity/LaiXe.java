package com.busdriver.model.entity;

import jakarta.persistence.*;
import com.busdriver.model.enums.TrinhDo;
import java.math.BigDecimal;

@Entity
@Table(name = "lai_xe")
public class LaiXe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "hoten")
    private String hoten;

    @Column(name = "diachi")
    private String diachi;

    @Column(name = "trinhdo")
    @Enumerated(EnumType.STRING)
    private TrinhDo trinhdo;

    @Column(name = "sodienthoai")
    private String sodienthoai;

    @Column(name = "hesoluong")
    private BigDecimal hesoluong;

    @Column(name = "cccd", nullable = false, unique = true, length = 12)
    private String cccd;

    @Column(name = "tongsotuyenlai")
    private Integer tongsotuyenlai;

    @Column(name = "luongphaitra")
    private BigDecimal luongphaitra;

    @Column(name = "luongdatra")
    private BigDecimal luongdatra;

    @Column(name = "luongconno")
    private BigDecimal luongconno;

    public LaiXe() {
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

    public String getDiachi() {
        return diachi;
    }

    public void setDiachi(String diachi) {
        this.diachi = diachi;
    }

    public TrinhDo getTrinhdo() {
        return trinhdo;
    }

    public void setTrinhdo(TrinhDo trinhdo) {
        this.trinhdo = trinhdo;
    }

    public String getSodienthoai() {
        return sodienthoai;
    }

    public void setSodienthoai(String sodienthoai) {
        this.sodienthoai = sodienthoai;
    }

    public BigDecimal getHesoluong() {
        return hesoluong;
    }

    public void setHesoluong(BigDecimal hesoluong) {
        this.hesoluong = hesoluong;
    }

    public Integer getTongsotuyenlai() {
        return tongsotuyenlai;
    }

    public void setTongsotuyenlai(Integer tongsotuyenlai) {
        this.tongsotuyenlai = tongsotuyenlai;
    }

    public BigDecimal getLuongphaitra() {
        return luongphaitra;
    }

    public void setLuongphaitra(BigDecimal luongphaitra) {
        this.luongphaitra = luongphaitra;
    }

    public BigDecimal getLuongdatra() {
        return luongdatra;
    }

    public void setLuongdatra(BigDecimal luongdatra) {
        this.luongdatra = luongdatra;
    }

    public BigDecimal getLuongconno() {
        return luongconno;
    }

    public void setLuongconno(BigDecimal luongconno) {
        this.luongconno = luongconno;
    }

    public String getCccd() {
        return cccd;
    }

    public void setCccd(String cccd) {
        this.cccd = cccd;
    }
}
