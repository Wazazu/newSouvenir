package com.miage.souvenir.repository;

import com.miage.souvenir.domain.Map;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Map entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MapRepository extends JpaRepository<Map, Long> {

}
