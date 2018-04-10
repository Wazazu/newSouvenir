package com.miage.souvenir.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.miage.souvenir.domain.Map;
import com.miage.souvenir.service.MapService;
import com.miage.souvenir.web.rest.errors.BadRequestAlertException;
import com.miage.souvenir.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Map.
 */
@RestController
@RequestMapping("/api")
public class MapResource {

    private final Logger log = LoggerFactory.getLogger(MapResource.class);

    private static final String ENTITY_NAME = "map";

    private final MapService mapService;

    public MapResource(MapService mapService) {
        this.mapService = mapService;
    }

    /**
     * POST  /maps : Create a new map.
     *
     * @param map the map to create
     * @return the ResponseEntity with status 201 (Created) and with body the new map, or with status 400 (Bad Request) if the map has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/maps")
    @Timed
    public ResponseEntity<Map> createMap(@RequestBody Map map) throws URISyntaxException {
        log.debug("REST request to save Map : {}", map);
        if (map.getId() != null) {
            throw new BadRequestAlertException("A new map cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Map result = mapService.save(map);
        return ResponseEntity.created(new URI("/api/maps/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /maps : Updates an existing map.
     *
     * @param map the map to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated map,
     * or with status 400 (Bad Request) if the map is not valid,
     * or with status 500 (Internal Server Error) if the map couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/maps")
    @Timed
    public ResponseEntity<Map> updateMap(@RequestBody Map map) throws URISyntaxException {
        log.debug("REST request to update Map : {}", map);
        if (map.getId() == null) {
            return createMap(map);
        }
        Map result = mapService.save(map);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, map.getId().toString()))
            .body(result);
    }

    /**
     * GET  /maps : get all the maps.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of maps in body
     */
    @GetMapping("/maps")
    @Timed
    public List<Map> getAllMaps() {
        log.debug("REST request to get all Maps");
        return mapService.findAll();
        }

    /**
     * GET  /maps/:id : get the "id" map.
     *
     * @param id the id of the map to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the map, or with status 404 (Not Found)
     */
    @GetMapping("/maps/{id}")
    @Timed
    public ResponseEntity<Map> getMap(@PathVariable Long id) {
        log.debug("REST request to get Map : {}", id);
        Map map = mapService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(map));
    }

    /**
     * DELETE  /maps/:id : delete the "id" map.
     *
     * @param id the id of the map to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/maps/{id}")
    @Timed
    public ResponseEntity<Void> deleteMap(@PathVariable Long id) {
        log.debug("REST request to delete Map : {}", id);
        mapService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
