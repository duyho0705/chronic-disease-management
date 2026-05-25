package com.project.service;

import com.project.dto.request.CreateClinicRequest;
import com.project.dto.request.CreateUserRequest;
import com.project.dto.request.UpdateClinicRequest;
import com.project.dto.request.UpdateUserRequest;
import com.project.dto.response.AdminClinicResponse;
import com.project.dto.response.AdminClinicStatsResponse;
import com.project.dto.response.AdminUserResponse;
import com.project.dto.response.AdminUserStatsResponse;
import com.project.entity.Clinic;
import com.project.entity.Patient;
import com.project.entity.User;
import com.project.entity.UserRole;
import com.project.exception.ResourceNotFoundException;
import com.project.mapper.ClinicMapper;
import com.project.mapper.UserMapper;
import com.project.repository.ClinicRepository;
import com.project.repository.PatientRepository;
import com.project.repository.SystemConfigRepository;
import com.project.repository.UserRepository;
import com.project.service.impl.AdminClinicServiceImpl;
import com.project.service.impl.AdminUserServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
@DisplayName("Admin Service Unit Tests (KCPM-26)")
class AdminServiceTest {

    // ================================================================
    // AdminUserService Tests
    // ================================================================
    @Nested
    @DisplayName("AdminUserService - Quản lý người dùng")
    class AdminUserServiceTests {

        @Mock private UserRepository userRepository;
        @Mock private PatientRepository patientRepository;
        @Mock private PasswordEncoder passwordEncoder;
        @Mock private UserMapper userMapper;
        @Mock private AuditService auditService;
        @Mock private SystemConfigRepository systemConfigRepository;
        @InjectMocks private AdminUserServiceImpl userService;

        private CreateUserRequest buildCreateUserRequest(String fullName, String email, String password, String role) {
            CreateUserRequest req = new CreateUserRequest();
            req.setFullName(fullName);
            req.setEmail(email);
            req.setPassword(password);
            req.setRole(role);
            return req;
        }

        @Test
        @DisplayName("TC-AS-001: Lấy thống kê người dùng thành công")
        void shouldGetUserStats() {
            when(userRepository.countByIsDeletedFalse()).thenReturn(100L);
            when(userRepository.countByRoleAndIsDeletedFalse(UserRole.ADMIN)).thenReturn(2L);
            when(userRepository.countByRoleAndIsDeletedFalse(UserRole.DOCTOR)).thenReturn(20L);
            when(userRepository.countByRoleAndIsDeletedFalse(UserRole.CLINIC_MANAGER)).thenReturn(5L);
            when(userRepository.countByRoleAndIsDeletedFalse(UserRole.PATIENT)).thenReturn(73L);

            AdminUserStatsResponse stats = userService.getUserStats();

            assertThat(stats.getTotalUsers()).isEqualTo(100);
            assertThat(stats.getDoctorCount()).isEqualTo(20);
            assertThat(stats.getPatientCount()).isEqualTo(73);
        }

        @Test
        @DisplayName("TC-AS-002: Lấy danh sách người dùng phân trang")
        void shouldGetUsersPaginated() {
            User user = User.builder().id(1L).fullName("Admin A").email("admin@mail.com").role(UserRole.ADMIN).build();
            Page<User> page = new PageImpl<>(List.of(user));
            when(userRepository.findByFilters(any(), any(), any(), any(), any(), any(), any(), any())).thenReturn(page);
            when(userMapper.toAdminUserResponse(any())).thenReturn(AdminUserResponse.builder().id(1L).fullName("Admin A").build());

            Page<AdminUserResponse> result = userService.getUsers(null, null, null, null, PageRequest.of(0, 10));

            assertThat(result.getContent()).hasSize(1);
            assertThat(result.getContent().get(0).getFullName()).isEqualTo("Admin A");
        }

        @Test
        @DisplayName("TC-AS-003: Lấy chi tiết người dùng theo ID")
        void shouldGetUserById() {
            User user = User.builder().id(1L).fullName("Doctor B").build();
            when(userRepository.findById(1L)).thenReturn(Optional.of(user));
            when(userMapper.toAdminUserResponse(user)).thenReturn(AdminUserResponse.builder().id(1L).fullName("Doctor B").build());

            AdminUserResponse result = userService.getUserById(1L);

            assertThat(result.getFullName()).isEqualTo("Doctor B");
        }

        @Test
        @DisplayName("TC-AS-004: Ném ResourceNotFoundException khi user không tồn tại")
        void shouldThrowWhenUserNotFound() {
            when(userRepository.findById(999L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> userService.getUserById(999L))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("User not found");
        }

        @Test
        @DisplayName("TC-AS-005: Tạo người dùng mới thành công (DOCTOR)")
        void shouldCreateUser() {
            CreateUserRequest request = buildCreateUserRequest("BS. Mới", "newdoc@mail.com", "Password1!", "DOCTOR");
            request.setClinicId(1L);
            when(systemConfigRepository.findFirstByOrderByIdAsc()).thenReturn(Optional.empty());
            when(passwordEncoder.encode(any())).thenReturn("encoded");
            when(userRepository.save(any())).thenAnswer(inv -> {
                User u = inv.getArgument(0); u.setId(50L); return u;
            });
            when(userMapper.toAdminUserResponse(any())).thenReturn(AdminUserResponse.builder().id(50L).fullName("BS. Mới").build());

            AdminUserResponse result = userService.createUser(request);

            assertThat(result.getId()).isEqualTo(50L);
            verify(auditService).recordActivity(any(), any(), any(), eq("success"));
        }

        @Test
        @DisplayName("TC-AS-006: Tạo PATIENT tự tạo hồ sơ bệnh nhân")
        void shouldCreatePatientProfile() {
            CreateUserRequest request = buildCreateUserRequest("BN. A", "patient@mail.com", "Password1!", "PATIENT");
            request.setClinicId(1L);
            when(systemConfigRepository.findFirstByOrderByIdAsc()).thenReturn(Optional.empty());
            when(passwordEncoder.encode(any())).thenReturn("encoded");
            when(userRepository.save(any())).thenAnswer(inv -> {
                User u = inv.getArgument(0); u.setId(60L); return u;
            });
            when(patientRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
            when(userMapper.toAdminUserResponse(any())).thenReturn(AdminUserResponse.builder().id(60L).build());

            userService.createUser(request);

            verify(patientRepository).save(any(Patient.class));
        }

        @Test
        @DisplayName("TC-AS-007: Ném lỗi khi mật khẩu quá ngắn")
        void shouldThrowWhenPasswordTooShort() {
            CreateUserRequest request = buildCreateUserRequest("Test", "t@mail.com", "123", "ADMIN");

            assertThatThrownBy(() -> userService.createUser(request))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("6 ký tự");
        }

        @Test
        @DisplayName("TC-AS-008: Cập nhật người dùng thành công")
        void shouldUpdateUser() {
            User existing = User.builder().id(1L).fullName("Cũ").email("old@mail.com").role(UserRole.DOCTOR).build();
            UpdateUserRequest request = new UpdateUserRequest();
            request.setFullName("Mới");
            when(userRepository.findById(1L)).thenReturn(Optional.of(existing));
            when(userRepository.save(any())).thenReturn(existing);
            when(userMapper.toAdminUserResponse(any())).thenReturn(AdminUserResponse.builder().id(1L).fullName("Mới").build());

            AdminUserResponse result = userService.updateUser(1L, request);

            assertThat(result.getFullName()).isEqualTo("Mới");
        }

        @Test
        @DisplayName("TC-AS-009: Toggle trạng thái ACTIVE → INACTIVE")
        void shouldToggleStatus() {
            User user = User.builder().id(1L).status("ACTIVE").email("u@mail.com").build();
            when(userRepository.findById(1L)).thenReturn(Optional.of(user));
            when(userRepository.save(any())).thenReturn(user);

            userService.toggleUserStatus(1L);

            assertThat(user.getStatus()).isEqualTo("INACTIVE");
            verify(auditService).recordActivity(any(), any(), any(), eq("warning"));
        }

        @Test
        @DisplayName("TC-AS-010: Xóa mềm người dùng (DOCTOR)")
        void shouldSoftDeleteUser() {
            User user = User.builder().id(1L).role(UserRole.DOCTOR).email("d@mail.com").build();
            when(userRepository.findById(1L)).thenReturn(Optional.of(user));
            when(userRepository.save(any())).thenReturn(user);

            userService.deleteUser(1L);

            assertThat(user.isDeleted()).isTrue();
            verify(auditService).recordActivity(any(), any(), any(), eq("danger"));
        }

        @Test
        @DisplayName("TC-AS-011: Xóa PATIENT đồng thời xóa hồ sơ bệnh nhân")
        void shouldDeletePatientProfile() {
            User user = User.builder().id(1L).role(UserRole.PATIENT).email("p@mail.com").build();
            Patient patient = Patient.builder().id(10L).userId(1L).build();
            when(userRepository.findById(1L)).thenReturn(Optional.of(user));
            when(userRepository.save(any())).thenReturn(user);
            when(patientRepository.findByUserIdAndIsDeletedFalse(1L)).thenReturn(Optional.of(patient));
            when(patientRepository.save(any())).thenReturn(patient);

            userService.deleteUser(1L);

            assertThat(user.isDeleted()).isTrue();
            assertThat(patient.isDeleted()).isTrue();
        }
    }

    // ================================================================
    // AdminClinicService Tests
    // ================================================================
    @Nested
    @DisplayName("AdminClinicService - Quản lý phòng khám")
    class AdminClinicServiceTests {

        @Mock private ClinicRepository clinicRepository;
        @Mock private UserRepository userRepository;
        @Mock private PasswordEncoder passwordEncoder;
        @Mock private ClinicMapper clinicMapper;
        @Mock private AuditService auditService;
        @InjectMocks private AdminClinicServiceImpl clinicService;

        @Test
        @DisplayName("TC-AS-012: Lấy thống kê phòng khám")
        void shouldGetClinicStats() {
            when(clinicRepository.countClinics()).thenReturn(10L);
            when(clinicRepository.countByStatusAndIsDeletedFalse("ACTIVE")).thenReturn(8L);
            when(clinicRepository.countByStatusAndIsDeletedFalse("INACTIVE")).thenReturn(2L);
            when(userRepository.countByRoleAndIsDeletedFalse(UserRole.DOCTOR)).thenReturn(30L);

            AdminClinicStatsResponse stats = clinicService.getClinicStats();

            assertThat(stats.getTotalClinics()).isEqualTo(10);
            assertThat(stats.getActiveClinics()).isEqualTo(8);
            assertThat(stats.getTotalDoctors()).isEqualTo(30);
        }

        @Test
        @DisplayName("TC-AS-013: Lấy danh sách phòng khám phân trang")
        void shouldGetClinicsPaginated() {
            Clinic c = Clinic.builder().id(1L).name("PK ABC").build();
            when(clinicRepository.findByFilters(any(), any(), any())).thenReturn(new PageImpl<>(List.of(c)));
            when(clinicMapper.toAdminClinicResponse(any())).thenReturn(AdminClinicResponse.builder().id(1L).name("PK ABC").build());

            Page<AdminClinicResponse> result = clinicService.getClinics(null, null, PageRequest.of(0, 10));

            assertThat(result.getContent()).hasSize(1);
        }

        @Test
        @DisplayName("TC-AS-014: Lấy chi tiết phòng khám theo ID")
        void shouldGetClinicById() {
            Clinic c = Clinic.builder().id(1L).name("PK ABC").build();
            when(clinicRepository.findById(1L)).thenReturn(Optional.of(c));
            when(clinicMapper.toAdminClinicResponse(c)).thenReturn(AdminClinicResponse.builder().id(1L).name("PK ABC").build());

            AdminClinicResponse result = clinicService.getClinicById(1L);
            assertThat(result.getName()).isEqualTo("PK ABC");
        }

        @Test
        @DisplayName("TC-AS-015: Ném ResourceNotFoundException khi phòng khám không tồn tại")
        void shouldThrowWhenClinicNotFound() {
            when(clinicRepository.findById(999L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> clinicService.getClinicById(999L))
                    .isInstanceOf(ResourceNotFoundException.class);
        }

        @Test
        @DisplayName("TC-AS-016: Tạo phòng khám kèm tài khoản quản lý")
        void shouldCreateClinicWithManager() {
            CreateClinicRequest req = new CreateClinicRequest();
            req.setName("PK Mới");
            req.setClinicCode("PK-NEW");
            req.setAdminFullName("QL. A");
            req.setAdminEmail("ql@mail.com");
            req.setAdminPassword("Password1!");
            when(clinicRepository.findByClinicCode("PK-NEW")).thenReturn(Optional.empty());
            when(passwordEncoder.encode(any())).thenReturn("encoded");
            when(clinicRepository.save(any())).thenAnswer(inv -> {
                Clinic c = inv.getArgument(0); c.setId(99L); return c;
            });
            when(userRepository.save(any())).thenAnswer(inv -> {
                User u = inv.getArgument(0); u.setId(88L); return u;
            });
            when(clinicMapper.toAdminClinicResponse(any())).thenReturn(AdminClinicResponse.builder().id(99L).name("PK Mới").build());

            AdminClinicResponse result = clinicService.createClinic(req);

            assertThat(result.getId()).isEqualTo(99L);
            verify(userRepository).save(any(User.class)); // Manager created
            verify(auditService).recordActivity(any(), any(), any(), eq("success"));
        }

        @Test
        @DisplayName("TC-AS-017: Ném lỗi khi mã phòng khám trùng")
        void shouldThrowWhenDuplicateClinicCode() {
            CreateClinicRequest req = new CreateClinicRequest();
            req.setClinicCode("PK-DUP");
            when(clinicRepository.findByClinicCode("PK-DUP")).thenReturn(Optional.of(new Clinic()));

            assertThatThrownBy(() -> clinicService.createClinic(req))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Mã phòng khám đã tồn tại");
        }

        @Test
        @DisplayName("TC-AS-018: Cập nhật phòng khám thành công")
        void shouldUpdateClinic() {
            Clinic c = Clinic.builder().id(1L).name("Cũ").build();
            UpdateClinicRequest req = new UpdateClinicRequest();
            req.setName("Mới");
            when(clinicRepository.findById(1L)).thenReturn(Optional.of(c));
            when(clinicRepository.save(any())).thenReturn(c);
            when(clinicMapper.toAdminClinicResponse(any())).thenReturn(AdminClinicResponse.builder().id(1L).name("Mới").build());

            AdminClinicResponse result = clinicService.updateClinic(1L, req);

            assertThat(result.getName()).isEqualTo("Mới");
        }

        @Test
        @DisplayName("TC-AS-019: Toggle trạng thái phòng khám ACTIVE → INACTIVE")
        void shouldToggleClinicStatus() {
            Clinic c = Clinic.builder().id(1L).name("PK A").status("ACTIVE").build();
            when(clinicRepository.findById(1L)).thenReturn(Optional.of(c));
            when(clinicRepository.save(any())).thenReturn(c);

            clinicService.toggleClinicStatus(1L);

            assertThat(c.getStatus()).isEqualTo("INACTIVE");
            verify(userRepository).updateStatusByClinicId(1L, "INACTIVE");
        }
    }
}
