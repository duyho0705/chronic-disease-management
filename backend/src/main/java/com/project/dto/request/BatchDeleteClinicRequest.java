package com.project.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchDeleteClinicRequest {

    @NotEmpty(message = "Danh sách ID phòng khám không được để trống")
    private List<Long> ids;
}
