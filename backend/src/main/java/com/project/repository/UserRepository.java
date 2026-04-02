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

    long countByStatus(String status);

    @Query("SELECT u FROM User u WHERE " +
           "(:role IS NULL OR u.role = :role) AND " +
           "(:status IS NULL OR u.status = :status) AND " +
           "(:clinicId IS NULL OR u.clinicId = :clinicId) AND " +
           "(:keyword IS NULL OR :keyword = '' OR LOWER(u.fullName) LIKE :keyword " +
           "OR LOWER(u.email) LIKE :keyword)")
    Page<User> findByFilters(String role, String status, Long clinicId, String keyword, Pageable pageable);
}
