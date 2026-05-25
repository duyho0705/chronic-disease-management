package com.project.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.dto.request.CreateClinicRequest;
import com.project.dto.request.CreateUserRequest;
import com.project.dto.response.*;
import com.project.exception.GlobalExceptionHandler;
import com.project.exception.ResourceNotFoundException;
import com.project.service.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import com.project.security.JwtTokenProvider;
import com.project.security.CustomUserDetailsService;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = {AdminController.class, GlobalExceptionHandler.class})
@AutoConfigureMockMvc
@SuppressWarnings("null")
@DisplayName("AdminController Integration Tests (KCPM-27)")
class AdminControllerTest {

    @Autowired private MockMvc mockMvc;
    @org.springframework.boot.test.mock.mockito.MockBean
    private JwtTokenProvider jwtTokenProvider;
    @org.springframework.boot.test.mock.mockito.MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Autowired private ObjectMapper objectMapper;

    @MockBean private AdminDashboardService adminDashboardService;
    @MockBean private AdminClinicService adminClinicService;
    @MockBean private AdminUserService adminUserService;
    @MockBean private AdminConfigService adminConfigService;

    private static final String BASE = "/api/v1/admin";

    // ================================================================
    // Dashboard
    // ================================================================
    @Nested
    @DisplayName("GET /admin/dashboard")
    class DashboardTests {

        @Test
        @DisplayName("TC-AC-001: Lấy dashboard Admin thành công")
        @WithMockUser(roles = "ADMIN")
        void shouldReturn200() throws Exception {
            when(adminDashboardService.getDashboardData(any(), any()))
                    .thenReturn(AdminDashboardResponse.builder().build());

            mockMvc.perform(get(BASE + "/dashboard"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true));
        }
    }

    // ================================================================
    // Clinic Management
    // ================================================================
    @Nested
    @DisplayName("Clinic Management")
    class ClinicTests {

        @Test
        @DisplayName("TC-AC-002: Lấy thống kê phòng khám thành công")
        @WithMockUser(roles = "ADMIN")
        void shouldGetClinicStats() throws Exception {
            when(adminClinicService.getClinicStats())
                    .thenReturn(AdminClinicStatsResponse.builder().totalClinics(10).build());

            mockMvc.perform(get(BASE + "/clinics/stats"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.totalClinics").value(10));
        }

        @Test
        @DisplayName("TC-AC-003: Lấy danh sách phòng khám phân trang")
        @WithMockUser(roles = "ADMIN")
        void shouldGetClinicsPaginated() throws Exception {
            AdminClinicResponse clinic = AdminClinicResponse.builder().id(1L).name("PK ABC").build();
            when(adminClinicService.getClinics(any(), any(), any()))
                    .thenReturn(new PageImpl<>(List.of(clinic)));

            mockMvc.perform(get(BASE + "/clinics"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.content[0].name").value("PK ABC"));
        }

        @Test
        @DisplayName("TC-AC-004: Tạo phòng khám thành công")
        @WithMockUser(roles = "ADMIN")
        void shouldCreateClinic() throws Exception {
            CreateClinicRequest req = new CreateClinicRequest();
            req.setName("PK Mới");
            req.setClinicCode("PK-001");
            req.setAdminFullName("QL. A");
            req.setAdminEmail("ql@mail.com");
            req.setAdminPassword("Password1!");
            when(adminClinicService.createClinic(any()))
                    .thenReturn(AdminClinicResponse.builder().id(1L).name("PK Mới").build());

            mockMvc.perform(post(BASE + "/clinics").with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.name").value("PK Mới"));
        }

        @Test
        @DisplayName("TC-AC-005: Trả 400 khi tạo phòng khám thiếu tên")
        @WithMockUser(roles = "ADMIN")
        void shouldReturn400_MissingClinicName() throws Exception {
            CreateClinicRequest req = new CreateClinicRequest();
            req.setName("");
            req.setClinicCode("PK-X");
            req.setAdminFullName("A");
            req.setAdminEmail("a@mail.com");
            req.setAdminPassword("Pass1!");

            mockMvc.perform(post(BASE + "/clinics").with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("TC-AC-006: Toggle trạng thái phòng khám thành công")
        @WithMockUser(roles = "ADMIN")
        void shouldToggleClinicStatus() throws Exception {
            doNothing().when(adminClinicService).toggleClinicStatus(1L);

            mockMvc.perform(patch(BASE + "/clinics/1/toggle-status").with(csrf()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").value("Clinic status toggled successfully"));
        }
    }

    // ================================================================
    // User Management
    // ================================================================
    @Nested
    @DisplayName("User Management")
    class UserTests {

        @Test
        @DisplayName("TC-AC-007: Lấy thống kê người dùng")
        @WithMockUser(roles = "ADMIN")
        void shouldGetUserStats() throws Exception {
            when(adminUserService.getUserStats())
                    .thenReturn(AdminUserStatsResponse.builder().totalUsers(100).build());

            mockMvc.perform(get(BASE + "/users/stats"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.totalUsers").value(100));
        }

        @Test
        @DisplayName("TC-AC-008: Lấy danh sách người dùng phân trang")
        @WithMockUser(roles = "ADMIN")
        void shouldGetUsersPaginated() throws Exception {
            AdminUserResponse user = AdminUserResponse.builder().id(1L).fullName("Admin A").build();
            when(adminUserService.getUsers(any(), any(), any(), any(), any()))
                    .thenReturn(new PageImpl<>(List.of(user)));

            mockMvc.perform(get(BASE + "/users"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.content[0].fullName").value("Admin A"));
        }

        @Test
        @DisplayName("TC-AC-009: Tạo người dùng thành công")
        @WithMockUser(roles = "ADMIN")
        void shouldCreateUser() throws Exception {
            CreateUserRequest req = new CreateUserRequest();
            req.setFullName("BS. Mới");
            req.setEmail("newdoc@mail.com");
            req.setPassword("Password1!");
            req.setRole("DOCTOR");
            when(adminUserService.createUser(any()))
                    .thenReturn(AdminUserResponse.builder().id(50L).fullName("BS. Mới").build());

            mockMvc.perform(post(BASE + "/users").with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.fullName").value("BS. Mới"));
        }

        @Test
        @DisplayName("TC-AC-010: Trả 400 khi tạo user thiếu email")
        @WithMockUser(roles = "ADMIN")
        void shouldReturn400_MissingEmail() throws Exception {
            CreateUserRequest req = new CreateUserRequest();
            req.setFullName("X");
            req.setEmail("");
            req.setPassword("Password1!");
            req.setRole("DOCTOR");

            mockMvc.perform(post(BASE + "/users").with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("TC-AC-011: Trả 400 khi tạo user thiếu mật khẩu")
        @WithMockUser(roles = "ADMIN")
        void shouldReturn400_MissingPassword() throws Exception {
            CreateUserRequest req = new CreateUserRequest();
            req.setFullName("X");
            req.setEmail("x@mail.com");
            req.setPassword("");
            req.setRole("DOCTOR");

            mockMvc.perform(post(BASE + "/users").with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("TC-AC-012: Trả 404 khi lấy user không tồn tại")
        @WithMockUser(roles = "ADMIN")
        void shouldReturn404_UserNotFound() throws Exception {
            when(adminUserService.getUserById(999L))
                    .thenThrow(new ResourceNotFoundException("User not found"));

            mockMvc.perform(get(BASE + "/users/999"))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.success").value(false));
        }

        @Test
        @DisplayName("TC-AC-013: Toggle trạng thái người dùng thành công")
        @WithMockUser(roles = "ADMIN")
        void shouldToggleUserStatus() throws Exception {
            doNothing().when(adminUserService).toggleUserStatus(1L);

            mockMvc.perform(patch(BASE + "/users/1/toggle-status").with(csrf()))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("TC-AC-014: Xóa người dùng thành công")
        @WithMockUser(roles = "ADMIN")
        void shouldDeleteUser() throws Exception {
            doNothing().when(adminUserService).deleteUser(1L);

            mockMvc.perform(delete(BASE + "/users/1").with(csrf()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").value("User deleted successfully"));
        }
    }

    // ================================================================
    // Reports & Config
    // ================================================================
    @Nested
    @DisplayName("Reports & Config")
    class ReportsConfigTests {

        @Test
        @DisplayName("TC-AC-015: Lấy báo cáo Admin thành công")
        @WithMockUser(roles = "ADMIN")
        void shouldGetReports() throws Exception {
            when(adminDashboardService.getReportsData(any(), any()))
                    .thenReturn(AdminReportsResponse.builder().build());

            mockMvc.perform(get(BASE + "/reports"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true));
        }

        @Test
        @DisplayName("TC-AC-016: Lấy cấu hình hệ thống thành công")
        @WithMockUser(roles = "ADMIN")
        void shouldGetConfig() throws Exception {
            when(adminConfigService.getConfig())
                    .thenReturn(SystemConfigResponse.builder().build());

            mockMvc.perform(get(BASE + "/config"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true));
        }
    }
}


