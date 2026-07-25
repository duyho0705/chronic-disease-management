package com.project.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateUserRequest {

    @Size(max = 100, message = "Họ và tên không được quá 100 ký tự")
    private String fullName;

    @Email(message = "Email không hợp lệ")
    private String email;

    @Pattern(regexp = "^(0[35789]\\d{8})?$", message = "Số điện thoại không đúng định dạng (phải gồm 10 chữ số bắt đầu bằng 03, 05, 07, 08, 09)")
    @Size(max = 20, message = "Số điện thoại không được quá 20 ký tự")
    private String phone;

    private String role;

    private Long clinicId;

    private String avatarUrl;

    private String status; // ACTIVE, INACTIVE

    private String password;

    private String licenseNumber;
    private String degree;
    private String bio;
    private String licenseImageUrl;
    private String specialization;

    @Pattern(regexp = "^\\d*$", message = "Kinh nghiệm phải là số năm")
    private String experience;
}

