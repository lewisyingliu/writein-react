package com.example.writein.intergration;

import com.example.writein.WriteInApplication;
import com.example.writein.controllers.UserController;
import com.example.writein.models.entities.User;
import com.example.writein.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = WriteInApplication.class)
@AutoConfigureMockMvc
public class UserIT {
    private static final String URL = "/api/users/";
    private final Faker faker = new Faker();
    @Autowired
    UserRepository userRepository;
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @Disabled
    void deleteUser() throws Exception {
//        String username = faker.name().username();
//        String password = faker.internet().password();
//        String email = faker.internet().emailAddress();
//        String firstName = faker.name().firstName();
//        String lastName = faker.name().lastName();
//
//        User user = new User();
//        user.setUsername(username);
//        user.setPassword(password);
//        user.setFirstName(firstName);
//        user.setLastName(lastName);
//        user.setEmail(email);
        List<Long> userIdList = new ArrayList<>();
        userIdList.add(1L);

        mockMvc.perform(post(URL + "deleteBatch")
                        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userIdList)))
                .andExpect(status().is(HttpStatus.NO_CONTENT.value()));

    }
}
