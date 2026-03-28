package com.project.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateClinicRequest {

    @NotBlank(message = "Tên phòng khám không được để trống")
    @Size(max = 200, message = "Tên phòng khám không được quá 200 ký tự")
    private String name;

    private String address;

    @Size(max = 20, message = "Số điện thoại không được quá 20 ký tự")
    private String phone;

    private String imageUrl;

    private Long managerId;
}
