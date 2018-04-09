package com.miage.souvenir.service;

import com.miage.souvenir.domain.Photo;
import com.miage.souvenir.repository.PhotoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing Photo.
 */
@Service
@Transactional
public class PhotoService {

    private final Logger log = LoggerFactory.getLogger(PhotoService.class);

    private final PhotoRepository photoRepository;

    public PhotoService(PhotoRepository photoRepository) {
        this.photoRepository = photoRepository;
    }

    /**
     * Save a photo.
     *
     * @param photo the entity to save
     * @return the persisted entity
     */
    public Photo save(Photo photo) {
        log.debug("Request to save Photo : {}", photo);
        return photoRepository.save(photo);
    }

    /**
     * Get all the photos.
     *
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<Photo> findAll() {
        log.debug("Request to get all Photos");
        return photoRepository.findAll();
    }

    /**
     * Get one photo by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Photo findOne(Long id) {
        log.debug("Request to get Photo : {}", id);
        return photoRepository.findOne(id);
    }

    /**
     * Delete the photo by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Photo : {}", id);
        photoRepository.delete(id);
    }
}
