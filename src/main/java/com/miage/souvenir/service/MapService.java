package com.miage.souvenir.service;

import com.miage.souvenir.domain.Map;
import com.miage.souvenir.repository.MapRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing Map.
 */
@Service
@Transactional
public class MapService {

    private final Logger log = LoggerFactory.getLogger(MapService.class);

    private final MapRepository mapRepository;

    public MapService(MapRepository mapRepository) {
        this.mapRepository = mapRepository;
    }

    /**
     * Save a map.
     *
     * @param map the entity to save
     * @return the persisted entity
     */
    public Map save(Map map) {
        log.debug("Request to save Map : {}", map);
        return mapRepository.save(map);
    }

    /**
     * Get all the maps.
     *
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<Map> findAll() {
        log.debug("Request to get all Maps");
        return mapRepository.findAll();
    }

    /**
     * Get one map by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Map findOne(Long id) {
        log.debug("Request to get Map : {}", id);
        return mapRepository.findOne(id);
    }

    /**
     * Delete the map by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Map : {}", id);
        mapRepository.delete(id);
    }
}
