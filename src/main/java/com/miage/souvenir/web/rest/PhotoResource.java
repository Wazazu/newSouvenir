package com.miage.souvenir.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.miage.souvenir.domain.Photo;
import com.miage.souvenir.service.PhotoService;
import com.miage.souvenir.web.rest.errors.BadRequestAlertException;
import com.miage.souvenir.web.rest.util.HeaderUtil;

import io.github.jhipster.config.JHipsterDefaults.Security;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.request;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

/**
 * REST controller for managing Photo.
 */
@RestController
@RequestMapping("/api")
public class PhotoResource {

	private final Logger log = LoggerFactory.getLogger(PhotoResource.class);

	private static final String ENTITY_NAME = "photo";

	private final PhotoService photoService;

	public PhotoResource(PhotoService photoService) {
		this.photoService = photoService;
	}

	/**
	 * POST /photos : Create a new photo.
	 *
	 * @param photo
	 *            the photo to create
	 * @return the ResponseEntity with status 201 (Created) and with body the new
	 *         photo, or with status 400 (Bad Request) if the photo has already an
	 *         ID
	 * @throws URISyntaxException
	 *             if the Location URI syntax is incorrect
	 */
	@PostMapping("/photos")
	@Timed
	public ResponseEntity<Photo> createPhoto(@RequestParam String description, @RequestParam MultipartFile file,
			HttpServletRequest request) throws URISyntaxException {
		Photo photo = new Photo();
		photo.setDescription(description);
		log.debug("REST request to save Photo : {}", photo);
		if (photo.getId() != null) {
			throw new BadRequestAlertException("A new photo cannot already have an ID", ENTITY_NAME, "idexists");
		}
		System.out.println(photo.toString());

		updatePath(photo, file, request);
		Photo result = photoService.save(photo);

		return ResponseEntity.created(new URI("/api/photos/" + result.getId()))
				.headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString())).body(result);
	} //

	private void updatePath(Photo photo, MultipartFile file, HttpServletRequest request) {
		if (!file.isEmpty()) {
			String realPathToUploads = request.getSession().getServletContext().getRealPath("/uploads/");
			if (!new File(realPathToUploads).exists()) {
				new File(realPathToUploads).mkdir();
			}
			String orgName = file.getOriginalFilename();
			String filePath = realPathToUploads + '/' + orgName;
			File dest = new File(filePath);
			try {
				file.transferTo(dest);
				photo.setPath(filePath);
			} catch (IllegalStateException | IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}

	/**
	 * PUT /photos : Updates an existing photo.
	 *
	 * @param photo
	 *            the photo to update
	 * @return the ResponseEntity with status 200 (OK) and with body the updated
	 *         photo, or with status 400 (Bad Request) if the photo is not valid, or
	 *         with status 500 (Internal Server Error) if the photo couldn't be
	 *         updated
	 * @throws URISyntaxException
	 *             if the Location URI syntax is incorrect
	 */

	@PutMapping("/photos")
	@Timed
	public ResponseEntity<Photo> updatePhoto(@RequestBody String id, @RequestParam String description,
			@RequestParam MultipartFile file, HttpServletRequest request) throws URISyntaxException {
		Photo photo = new Photo();
		photo.setId(Long.valueOf(id));
		photo.setDescription(description);
		log.debug("REST request to update Photo : {}", photo);
		if (photo.getId() == null) {
			return createPhoto(description, file, request);
		}
		updatePath(photo, file, request);
		Photo result = photoService.save(photo);
		return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, photo.getId().toString()))
				.body(result);
	}

	/**
	 * GET /photos : get all the photos.
	 *
	 * @return the ResponseEntity with status 200 (OK) and the list of photos in
	 *         body
	 */
	@GetMapping("/photos")
	@Timed
	public List<Photo> getAllPhotos() {
		log.debug("REST request to get all Photos");
		return photoService.findAll();
	}

	/**
	 * GET /photos/:id : get the "id" photo.
	 *
	 * @param id
	 *            the id of the photo to retrieve
	 * @return the ResponseEntity with status 200 (OK) and with body the photo, or
	 *         with status 404 (Not Found)
	 */
	@GetMapping("/photos/{id}")
	@Timed
	public ResponseEntity<Photo> getPhoto(@PathVariable Long id) {
		log.debug("REST request to get Photo : {}", id);
		Photo photo = photoService.findOne(id);
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(photo));
	}

	/**
	 * DELETE /photos/:id : delete the "id" photo.
	 *
	 * @param id
	 *            the id of the photo to delete
	 * @return the ResponseEntity with status 200 (OK)
	 */
	@DeleteMapping("/photos/{id}")
	@Timed
	public ResponseEntity<Void> deletePhoto(@PathVariable Long id) {
		log.debug("REST request to delete Photo : {}", id);
		Photo photo = photoService.findOne(id);
		String path = photo.getPath();
		photoService.delete(id);
		File file = new File(path);
		file.delete();
		return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
	}
}
