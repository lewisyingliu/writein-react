package com.example.writein.controllers;

import com.example.writein.WriteInApplication;
import com.example.writein.models.entities.Election;
import com.example.writein.repository.ElectionRepository;
import com.example.writein.security.jwt.JwtUtils;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.time.Month;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = WriteInApplication.class)
@AutoConfigureMockMvc
class ElectionControllerTest {
    private static final String URL = "/api/elections/";
    String title = "Primary Election 8-3-2022";
    String code = "08032022";
    LocalDate electionDate = LocalDate.of(2022, Month.AUGUST, 3);
    Boolean defaultTag = true;
    private Election election = new Election();

    @Autowired
    ElectionRepository electionRepository;
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        election.setTitle(title);
        election.setCode(code);
        election.setDefaultTag(defaultTag);
        election.setElectionDate(electionDate);
    }

    @Test
    public void CanFindAllElection() throws Exception {
        mockMvc.perform(post(URL)
                        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(election)))
                .andExpect(status().is(HttpStatus.CREATED.value()));

        mockMvc.perform(get(URL).accept(MediaType.APPLICATION_JSON))
                .andExpect(status().is(HttpStatus.OK.value()))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].title", is(title)))
                .andExpect(jsonPath("$[0].code", is(code)))
                .andExpect(jsonPath("$[0].defaultTag", is(defaultTag)));
    }

    @Test
    void canAddNewElection() throws Exception {
        mockMvc.perform(post(URL)
                        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(election)))
                .andExpect(status().is(HttpStatus.CREATED.value()));
    }

    @Test
    void canDeleteElection() throws Exception {
        mockMvc.perform(post(URL)
                        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(election)))
                .andExpect(status().is(HttpStatus.CREATED.value()));
        MvcResult getElectionsResult = mockMvc.perform(get(URL)
                        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON))
                .andExpect(status().is(HttpStatus.OK.value()))
                .andReturn();
        String contentAsString = getElectionsResult
                .getResponse()
                .getContentAsString();
        List<Election> elections = objectMapper.readValue(
                contentAsString,
                new TypeReference<>() {
                }
        );
        long id = elections.stream()
                .filter(s -> s.getTitle().equals(election.getTitle()))
                .map(Election::getId)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("election with title: " + title + " not found"));
        ResultActions resultActions = mockMvc
                .perform(delete(URL + id));
        resultActions.andExpect(status().is(HttpStatus.NO_CONTENT.value()));
        boolean exists = electionRepository.existsById(id);
        assertThat(exists).isFalse();
    }
}