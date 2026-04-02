package com.project.repository;

import com.project.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    long countByRole(String role);

    long countByRoleAndClinicId(String role, Long clinicId);

    @Query("SELECT u.clinicId, COUNT(u) FROM User u WHERE u.role = :role GROUP BY u.clinicId")
    java.util.List<Object[]> countByRoleGroupedByClinic(String role);

    long countByStatus(String status);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = 'PATIENT' AND u.createdAt >= :startDate AND u.createdAt < :endDate")
    long countNewPatientsBetween(java.time.LocalDateTime startDate, java.time.LocalDateTime endDate);

    @Query(value = "SELECT CAST(created_at AS DATE) as d, COUNT(*) FROM users " +
           "WHERE role = 'PATIENT' AND created_at >= :startDate " +
           "GROUP BY CAST(created_at AS DATE) ORDER BY d ASC", nativeQuery = true)
    java.util.List<Object[]> countNewPatientsByDayNative(java.time.LocalDateTime startDate);

    @Query(value = "SELECT DATE_TRUNC('month', created_at) as m, COUNT(*) FROM users " +
           "WHERE role = 'PATIENT' AND created_at >= :startDate " +
           "GROUP BY m ORDER BY m ASC", nativeQuery = true)
    java.util.List<Object[]> countNewPatientsByMonthNative(java.time.LocalDateTime startDate);

    @Query(value = "SELECT DATE_TRUNC('year', created_at) as y, COUNT(*) FROM users " +
           "WHERE role = 'PATIENT' AND created_at >= :startDate " +
           "GROUP BY y ORDER BY y ASC", nativeQuery = true)
    java.util.List<Object[]> countNewPatientsByYearNative(java.time.LocalDateTime startDate);

    @Query("SELECT u FROM User u WHERE " +
           "(:role IS NULL OR u.role = :role) AND " +
           "(:status IS NULL OR u.status = :status) AND " +
           "(:clinicId IS NULL OR u.clinicId = :clinicId) AND " +
           "(:keyword IS NULL OR :keyword = '' OR LOWER(u.fullName) LIKE :keyword " +
           "OR LOWER(u.email) LIKE :keyword)")
    Page<User> findByFilters(String role, String status, Long clinicId, String keyword, Pageable pageable);
}
