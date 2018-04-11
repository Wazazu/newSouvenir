package com.miage.souvenir.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.miage.souvenir.domain.Memory;
import com.miage.souvenir.domain.User;
import com.miage.souvenir.repository.MemoryRepository;
import com.miage.souvenir.repository.UserRepository;
import com.miage.souvenir.security.SecurityUtils;
import com.miage.souvenir.service.MemoryService;
import com.miage.souvenir.web.rest.errors.BadRequestAlertException;
import com.miage.souvenir.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Memory.
 */
@RestController
@RequestMapping("/api")
public class MemoryResource {

    private final Logger log = LoggerFactory.getLogger(MemoryResource.class);

    private static final String ENTITY_NAME = "memory";

    private final MemoryService memoryService;
    
    @Autowired
    private MemoryRepository memoryRepository;

    @Autowired
    private UserRepository userRepository;
    
    public MemoryResource(MemoryService memoryService) {
        this.memoryService = memoryService;
    }

    /**
     * POST  /memories : Create a new memory.
     *
     * @param memory the memory to create
     * @return the ResponseEntity with status 201 (Created) and with body the new memory, or with status 400 (Bad Request) if the memory has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/memories")
    @Timed
    public ResponseEntity<Memory> createMemory(@Valid @RequestBody Memory memory) throws URISyntaxException {
        log.debug("REST request to save Memory : {}", memory);
        if (memory.getId() != null) {
            throw new BadRequestAlertException("A new memory cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Optional<String> userLogin = SecurityUtils.getCurrentUserLogin();
        Optional<User> user = userRepository.findOneByLogin(userLogin.get());
        memory.setUser(user.get());
        Memory result = memoryService.save(memory);
        return ResponseEntity.created(new URI("/api/memories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /memories : Updates an existing memory.
     *
     * @param memory the memory to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated memory,
     * or with status 400 (Bad Request) if the memory is not valid,
     * or with status 500 (Internal Server Error) if the memory couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/memories")
    @Timed
    public ResponseEntity<Memory> updateMemory(@Valid @RequestBody Memory memory) throws URISyntaxException {
        log.debug("REST request to update Memory : {}", memory);
        if (memory.getId() == null) {
            return createMemory(memory);
        }
        Memory result = memoryService.save(memory);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, memory.getId().toString()))
            .body(result);
    }

    /**
     * GET  /memories : get all the memories.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of memories in body
     */
    @GetMapping("/memories")
    @Timed
    public List<Memory> getAllMemories() {
        log.debug("REST request to get all Memories");
        Optional<String> userLogin = SecurityUtils.getCurrentUserLogin();
        Optional<User> user = userRepository.findOneByLogin(userLogin.get());
        return memoryRepository.findByUser(user.get());
        }

    /**
     * GET  /memories/:id : get the "id" memory.
     *
     * @param id the id of the memory to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the memory, or with status 404 (Not Found)
     */
    @GetMapping("/memories/{id}")
    @Timed
    public ResponseEntity<Memory> getMemory(@PathVariable Long id) {
        log.debug("REST request to get Memory : {}", id);
        Memory memory = memoryService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(memory));
    }

    /**
     * DELETE  /memories/:id : delete the "id" memory.
     *
     * @param id the id of the memory to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/memories/{id}")
    @Timed
    public ResponseEntity<Void> deleteMemory(@PathVariable Long id) {
        log.debug("REST request to delete Memory : {}", id);
        memoryService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
