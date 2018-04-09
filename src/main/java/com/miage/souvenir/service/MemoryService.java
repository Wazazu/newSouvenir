package com.miage.souvenir.service;

import com.miage.souvenir.domain.Memory;
import com.miage.souvenir.repository.MemoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing Memory.
 */
@Service
@Transactional
public class MemoryService {

    private final Logger log = LoggerFactory.getLogger(MemoryService.class);

    private final MemoryRepository memoryRepository;

    public MemoryService(MemoryRepository memoryRepository) {
        this.memoryRepository = memoryRepository;
    }

    /**
     * Save a memory.
     *
     * @param memory the entity to save
     * @return the persisted entity
     */
    public Memory save(Memory memory) {
        log.debug("Request to save Memory : {}", memory);
        return memoryRepository.save(memory);
    }

    /**
     * Get all the memories.
     *
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<Memory> findAll() {
        log.debug("Request to get all Memories");
        return memoryRepository.findAll();
    }

    /**
     * Get one memory by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Memory findOne(Long id) {
        log.debug("Request to get Memory : {}", id);
        return memoryRepository.findOne(id);
    }

    /**
     * Delete the memory by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Memory : {}", id);
        memoryRepository.delete(id);
    }
}
