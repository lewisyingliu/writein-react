package com.example.writein.controllers;

import com.example.writein.WriteInApplication;
import com.example.writein.models.entities.Election;
import com.example.writein.repository.ElectionRepository;
import com.example.writein.security.jwt.JwtUtils;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.javafaker.Book;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;

import java.time.LocalDate;
import java.time.Month;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.util.AssertionErrors.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.Matchers.is;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = WriteInApplication.class)
//@Sql({"classpath:election-data.sql"})
@AutoConfigureMockMvc
//@ActiveProfiles("test")
public class TestOne {
    private static final String URL = "/api/elections/";
//    @Autowired
//    private TestRestTemplate restTemplate;
    @Autowired
    private ElectionRepository electionRepository;
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;

//    @Test
//    public void test() {
//        assertNotNull(restTemplate);
//    }

    @Test
    public void testDeleteElection() throws Exception {
        List<Election> elections1 = electionRepository.findAll();
        System.out.println(elections1.size());
        mockMvc.perform(delete(URL + "{id}", 1))
                .andExpect(status().is(HttpStatus.NO_CONTENT.value()));
        List<Election> electionList = electionRepository.findAll();
        System.out.println(electionList.size());

//        // execute - delete the record added while initializing database with
//        // test data
//        List<Election> elections1 = electionRepository.findAll();
//        System.out.println(elections1.size());
//        ResponseEntity<Void> responseEntity = restTemplate.exchange(URL + "{id}", HttpMethod.DELETE, null, Void.class, 1);
//        List<Election> electionList = electionRepository.findAll();
//        System.out.println(electionList.size());
//        // verify
//        int status = responseEntity.getStatusCodeValue();
//        System.out.println(status);
//        assertEquals("Incorrect Response Status", HttpStatus.GONE.value(), status);

    }
    @Test
    void canDeleteElection() throws Exception {
        String title = "Primary Election 8-3-2022";
        String code = "08032022";
        LocalDate electionDate = LocalDate.of(2022, Month.AUGUST, 3);
        Boolean defaultTag = true;

        Election election = new Election();
        election.setTitle(title);
        election.setCode(code);
        election.setDefaultTag(defaultTag);
        election.setElectionDate(electionDate);

        mockMvc.perform(post(URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(election)))
                .andExpect(status().is(HttpStatus.CREATED.value()));
        MvcResult getElectionsResult = mockMvc.perform(get(URL)
                        .contentType(MediaType.APPLICATION_JSON))
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

    @Test
    void canAddNewElection() throws Exception {
        String title = "Primary Election 8-3-2022";
        String code = "08032022";
        LocalDate electionDate = LocalDate.of(2022, Month.AUGUST, 3);
        Boolean defaultTag = true;

        Election election = new Election();
        election.setTitle(title);
        election.setCode(code);
        election.setDefaultTag(defaultTag);
        election.setElectionDate(electionDate);
        mockMvc.perform(post(URL)
                        .content(objectMapper.writeValueAsString(election))
                        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.title", is(title)))
                .andExpect(jsonPath("$.code", is(code)));
        System.out.println(electionRepository.findAll().size());
    }
}