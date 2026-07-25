package com.project.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateClinicRequest {

    @Size(max = 200, message = "Tên phòng khám không được quá 200 ký tự")
    private String name;

    private String address;

    @Pattern(regexp = "^(0[35789]\\d{8})?$", message = "Số điện thoại phòng khám không đúng định dạng (phải gồm 10 chữ số bắt đầu bằng 03, 05, 07, 08, 09)")
    @Size(max = 20, message = "Số điện thoại không được quá 20 ký tự")
    private String phone;

    @Email(message = "Email phòng khám không hợp lệ")
    private String email;

    private String description;

    private String imageUrl;

    private Long managerId;

    private String adminFullName;

    @Email(message = "Email quản lý không hợp lệ")
    private String adminEmail;

    private String status; // ACTIVE, INACTIVE
}

