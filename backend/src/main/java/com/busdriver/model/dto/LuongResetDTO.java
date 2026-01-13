package com.busdriver.model.dto;

public class LuongResetDTO {
    private String mode; // "RESET_PAID_ONLY" or "RESET_ALL"

    public LuongResetDTO() {
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }
}
