package com.miage.souvenir.repository;

import com.google.common.base.Optional;
import com.miage.souvenir.domain.Memory;
import com.miage.souvenir.domain.User;

import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import java.util.List;

/**
 * Spring Data JPA repository for the Memory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MemoryRepository extends JpaRepository<Memory, Long> {

    @Query("select memory from Memory memory where memory.user.login = ?#{principal.username}")
    List<Memory> findByUserIsCurrentUser();

    
    List<Memory> findByUser(User user);
}
