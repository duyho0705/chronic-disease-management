package com.project.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateClinicRequest {

    @NotBlank(message = "Tên phòng khám không được để trống")
    @Size(max = 200, message = "Tên phòng khám không được quá 200 ký tự")
    private String name;

    @NotBlank(message = "Mã định danh không được để trống")
    @Size(max = 20, message = "Mã định danh không được quá 20 ký tự")
    private String clinicCode;

    private String address;

    @Size(max = 20, message = "Số điện thoại không được quá 20 ký tự")
    private String phone;

    private String imageUrl;

    // Admin Account Information (Clinic Manager)
    @NotBlank(message = "Họ và tên người quản lý không được để trống")
    private String adminFullName;

    @NotBlank(message = "Email đăng nhập không được để trống")
    private String adminEmail;

    @NotBlank(message = "Mật khẩu không được để trống")
    private String adminPassword;
}
