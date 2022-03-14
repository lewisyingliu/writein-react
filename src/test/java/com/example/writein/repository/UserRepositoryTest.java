package com.example.writein.repository;

import com.example.writein.models.ERole;
import com.example.writein.models.entities.Role;
import com.example.writein.models.entities.User;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.HashSet;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
class UserRepositoryTest {

    private final Faker faker = new Faker();
    @Autowired
    private UserRepository underTest;
    @Autowired
    private RoleRepository roleRepository;

    @AfterEach
    void tearDown() {
        underTest.deleteAll();
    }

    @Test
    void findAdminUser() {
        Role role = new Role();
        role.setName(ERole.ROLE_ADMIN);
        roleRepository.save(role);
        HashSet<Role> roles = new HashSet<Role>();
        roles.add(role);
        User user = new User(faker.name().username(), faker.internet().emailAddress(), faker.internet().password());
        user.setRoles(roles);
        underTest.save(user);

        List<User> users = underTest.findAdminUser();

        assertThat(users.isEmpty()).isFalse();

    }

    @Test
    void findWriteInUser() {
        Role role = new Role();
        role.setName(ERole.ROLE_USER);
        roleRepository.save(role);
        HashSet<Role> roles = new HashSet<Role>();
        roles.add(role);
        User user = new User(faker.name().username(), faker.internet().emailAddress(), faker.internet().password());
        user.setRoles(roles);
        underTest.save(user);

        List<User> users = underTest.findWriteInUser();

        assertThat(users.isEmpty()).isFalse();

    }

}