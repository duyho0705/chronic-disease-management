package com.project.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
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

    @Pattern(regexp = "^(0[35789]\\d{8})?$", message = "Số điện thoại phòng khám không đúng định dạng (phải gồm 10 chữ số bắt đầu bằng 03, 05, 07, 08, 09)")
    @Size(max = 20, message = "Số điện thoại không được quá 20 ký tự")
    private String phone;

    private String imageUrl;

    // Admin Account Information (Clinic Manager)
    @NotBlank(message = "Họ và tên người quản lý không được để trống")
    private String adminFullName;

    @NotBlank(message = "Email đăng nhập không được để trống")
    @Email(message = "Email đăng nhập không hợp lệ")
    private String adminEmail;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, message = "Mật khẩu quản lý phải có ít nhất 6 ký tự")
    private String adminPassword;
}

