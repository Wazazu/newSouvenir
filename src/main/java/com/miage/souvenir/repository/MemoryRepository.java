package com.miage.souvenir.repository;

import com.miage.souvenir.domain.Memory;
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

}
