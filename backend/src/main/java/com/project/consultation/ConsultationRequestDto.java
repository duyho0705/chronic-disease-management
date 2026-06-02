package com.project.consultation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ConsultationRequestDto {
    @NotBlank(message = "Tên không được để trống")
    private String name;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^(0[3|5|7|8|9])+([0-9]{8})$", message = "Số điện thoại không hợp lệ")
    private String phone;

    private String email;

    @NotBlank(message = "Quy mô phòng khám không được để trống")
    private String department;

    @NotBlank(message = "Ngày hẹn không được để trống")
    private String date;

    private String message;
}
