package com.project.repository;

import com.project.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    @Query("SELECT a FROM AuditLog a WHERE " +
           "(:userName IS NULL OR LOWER(a.userName) LIKE CAST(:userName AS text)) AND " +
           "(:module IS NULL OR a.module = :module) AND " +
           "(:keyword IS NULL OR LOWER(a.details) LIKE CAST(:keyword AS text) OR a.ipAddress LIKE CAST(:keyword AS text))")
    Page<AuditLog> findByFilters(
            @org.springframework.data.repository.query.Param("userName") String userName, 
            @org.springframework.data.repository.query.Param("module") String module, 
            @org.springframework.data.repository.query.Param("keyword") String keyword, 
            Pageable pageable);
}
