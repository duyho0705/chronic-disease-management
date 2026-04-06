package com.project.repository;

import com.project.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdAndReadFalseAndIsDeletedFalseOrderByCreatedAtDesc(Long userId);
    List<Notification> findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(Long userId);
    List<Notification> findAllByUserIdAndReadFalseAndIsDeletedFalse(Long userId);
    long countByUserIdAndReadFalseAndIsDeletedFalse(Long userId);
}
