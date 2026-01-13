package com.busdriver.model.dto;

import com.busdriver.model.enums.TrinhDo;
import java.math.BigDecimal;

public class LaiXeDTO {
    private Long id;
    private String hoten;
    private String diachi;
    private TrinhDo trinhdo;
    private String sodienthoai;
    private BigDecimal hesoluong;
    private String cccd;
    private Integer tongsotuyenlai;
    private BigDecimal luongphaitra;
    private BigDecimal luongdatra;
    private BigDecimal luongconno;

    public LaiXeDTO() {
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
