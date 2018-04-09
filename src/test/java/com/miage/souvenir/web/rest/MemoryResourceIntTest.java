package com.miage.souvenir.web.rest;

import com.miage.souvenir.SouvenirApp;

import com.miage.souvenir.domain.Memory;
import com.miage.souvenir.repository.MemoryRepository;
import com.miage.souvenir.service.MemoryService;
import com.miage.souvenir.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;

import static com.miage.souvenir.web.rest.TestUtil.sameInstant;
import static com.miage.souvenir.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the MemoryResource REST controller.
 *
 * @see MemoryResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SouvenirApp.class)
public class MemoryResourceIntTest {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_START_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_START_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_END_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_END_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Double DEFAULT_LONGITUDE = 1D;
    private static final Double UPDATED_LONGITUDE = 2D;

    private static final Double DEFAULT_LATITUDE = 1D;
    private static final Double UPDATED_LATITUDE = 2D;

    @Autowired
    private MemoryRepository memoryRepository;

    @Autowired
    private MemoryService memoryService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restMemoryMockMvc;

    private Memory memory;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final MemoryResource memoryResource = new MemoryResource(memoryService);
        this.restMemoryMockMvc = MockMvcBuilders.standaloneSetup(memoryResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Memory createEntity(EntityManager em) {
        Memory memory = new Memory()
            .title(DEFAULT_TITLE)
            .description(DEFAULT_DESCRIPTION)
            .startDate(DEFAULT_START_DATE)
            .endDate(DEFAULT_END_DATE)
            .longitude(DEFAULT_LONGITUDE)
            .latitude(DEFAULT_LATITUDE);
        return memory;
    }

    @Before
    public void initTest() {
        memory = createEntity(em);
    }

    @Test
    @Transactional
    public void createMemory() throws Exception {
        int databaseSizeBeforeCreate = memoryRepository.findAll().size();

        // Create the Memory
        restMemoryMockMvc.perform(post("/api/memories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(memory)))
            .andExpect(status().isCreated());

        // Validate the Memory in the database
        List<Memory> memoryList = memoryRepository.findAll();
        assertThat(memoryList).hasSize(databaseSizeBeforeCreate + 1);
        Memory testMemory = memoryList.get(memoryList.size() - 1);
        assertThat(testMemory.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testMemory.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testMemory.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testMemory.getEndDate()).isEqualTo(DEFAULT_END_DATE);
        assertThat(testMemory.getLongitude()).isEqualTo(DEFAULT_LONGITUDE);
        assertThat(testMemory.getLatitude()).isEqualTo(DEFAULT_LATITUDE);
    }

    @Test
    @Transactional
    public void createMemoryWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = memoryRepository.findAll().size();

        // Create the Memory with an existing ID
        memory.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restMemoryMockMvc.perform(post("/api/memories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(memory)))
            .andExpect(status().isBadRequest());

        // Validate the Memory in the database
        List<Memory> memoryList = memoryRepository.findAll();
        assertThat(memoryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllMemories() throws Exception {
        // Initialize the database
        memoryRepository.saveAndFlush(memory);

        // Get all the memoryList
        restMemoryMockMvc.perform(get("/api/memories?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(memory.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(sameInstant(DEFAULT_START_DATE))))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(sameInstant(DEFAULT_END_DATE))))
            .andExpect(jsonPath("$.[*].longitude").value(hasItem(DEFAULT_LONGITUDE.doubleValue())))
            .andExpect(jsonPath("$.[*].latitude").value(hasItem(DEFAULT_LATITUDE.doubleValue())));
    }

    @Test
    @Transactional
    public void getMemory() throws Exception {
        // Initialize the database
        memoryRepository.saveAndFlush(memory);

        // Get the memory
        restMemoryMockMvc.perform(get("/api/memories/{id}", memory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(memory.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.startDate").value(sameInstant(DEFAULT_START_DATE)))
            .andExpect(jsonPath("$.endDate").value(sameInstant(DEFAULT_END_DATE)))
            .andExpect(jsonPath("$.longitude").value(DEFAULT_LONGITUDE.doubleValue()))
            .andExpect(jsonPath("$.latitude").value(DEFAULT_LATITUDE.doubleValue()));
    }

    @Test
    @Transactional
    public void getNonExistingMemory() throws Exception {
        // Get the memory
        restMemoryMockMvc.perform(get("/api/memories/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMemory() throws Exception {
        // Initialize the database
        memoryService.save(memory);

        int databaseSizeBeforeUpdate = memoryRepository.findAll().size();

        // Update the memory
        Memory updatedMemory = memoryRepository.findOne(memory.getId());
        // Disconnect from session so that the updates on updatedMemory are not directly saved in db
        em.detach(updatedMemory);
        updatedMemory
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .longitude(UPDATED_LONGITUDE)
            .latitude(UPDATED_LATITUDE);

        restMemoryMockMvc.perform(put("/api/memories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedMemory)))
            .andExpect(status().isOk());

        // Validate the Memory in the database
        List<Memory> memoryList = memoryRepository.findAll();
        assertThat(memoryList).hasSize(databaseSizeBeforeUpdate);
        Memory testMemory = memoryList.get(memoryList.size() - 1);
        assertThat(testMemory.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testMemory.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testMemory.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testMemory.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testMemory.getLongitude()).isEqualTo(UPDATED_LONGITUDE);
        assertThat(testMemory.getLatitude()).isEqualTo(UPDATED_LATITUDE);
    }

    @Test
    @Transactional
    public void updateNonExistingMemory() throws Exception {
        int databaseSizeBeforeUpdate = memoryRepository.findAll().size();

        // Create the Memory

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restMemoryMockMvc.perform(put("/api/memories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(memory)))
            .andExpect(status().isCreated());

        // Validate the Memory in the database
        List<Memory> memoryList = memoryRepository.findAll();
        assertThat(memoryList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteMemory() throws Exception {
        // Initialize the database
        memoryService.save(memory);

        int databaseSizeBeforeDelete = memoryRepository.findAll().size();

        // Get the memory
        restMemoryMockMvc.perform(delete("/api/memories/{id}", memory.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Memory> memoryList = memoryRepository.findAll();
        assertThat(memoryList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Memory.class);
        Memory memory1 = new Memory();
        memory1.setId(1L);
        Memory memory2 = new Memory();
        memory2.setId(memory1.getId());
        assertThat(memory1).isEqualTo(memory2);
        memory2.setId(2L);
        assertThat(memory1).isNotEqualTo(memory2);
        memory1.setId(null);
        assertThat(memory1).isNotEqualTo(memory2);
    }
}
