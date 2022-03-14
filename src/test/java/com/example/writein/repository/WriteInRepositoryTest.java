package com.example.writein.repository;

import com.example.writein.models.ERole;
import com.example.writein.models.entities.*;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.HashSet;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
class WriteInRepositoryTest {
    private final Faker faker = new Faker();
    @Autowired
    private WriteInRepository underTest;
    @Autowired
    private ElectionRepository electionRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CountingBoardRepository countingBoardRepository;
    @Autowired
    private OfficeRepository officeRepository;
    @Autowired
    private RoleRepository roleRepository;

    @AfterEach
    void tearDown() {
        underTest.deleteAll();
    }

    @Test
    void searchByElection() {
        Election election = new Election();
        election.setCode(faker.code().toString());
        election.setTitle(faker.name().name());
        election.setDefaultTag(true);
        election.setElectionDate(LocalDate.of(2022, Month.AUGUST, 3));
        electionRepository.save(election);
        CountingBoard countingBoard = new CountingBoard();
        countingBoard.setElection(election);
        countingBoard.setDisplayOrder(1);
        countingBoard.setTitle("AVCB1");
        countingBoardRepository.save(countingBoard);
        Office office = new Office();
        office.setElection(election);
        office.setDisplayOrder(1);
        office.setTitle("Mayor");
        officeRepository.save(office);
        User user = new User();
        Optional<Role> role = roleRepository.findByName(ERole.ROLE_USER);
        if (role.isPresent()) {
            HashSet<Role> roles = new HashSet<>();
            roles.add(role.get());
            user.setRoles(roles);
        }
        user.setUsername("station1");
        user.setUserCode("123456");
        user.setPassword("123456");
        user.setElection(election);
        userRepository.save(user);

        WriteInRecord writeInRecord = new WriteInRecord();
        writeInRecord.setElection(election);
        writeInRecord.setUser(user);
        writeInRecord.setOffice(office);
        writeInRecord.setCountingBoard(countingBoard);
        String firstName = "john";
        String lastName = "smith";
        String middleName = "z";
        writeInRecord.setFirstName(firstName);
        writeInRecord.setLastName(lastName);
        writeInRecord.setMiddleName(middleName);
        writeInRecord.setCreatedAt(LocalDateTime.now());
        writeInRecord.setRecordCount(1);
        writeInRecord.setBatchNumber("789");
        underTest.save(writeInRecord);

        Pageable pageRequest = PageRequest.of(0, 5);

        assertThat(underTest.searchByElection(election.getId(), "j", pageRequest).isEmpty()).isFalse();
        assertThat(underTest.searchByElection(election.getId(), "smith", pageRequest).isEmpty()).isFalse();
        assertThat(underTest.searchByElection(election.getId(), "t", pageRequest).isEmpty()).isFalse();
        assertThat(underTest.searchByElection(election.getId(), "May", pageRequest).isEmpty()).isFalse();
        assertThat(underTest.searchByElection(election.getId(), "AVC", pageRequest).isEmpty()).isFalse();
        assertThat(underTest.searchByElection(election.getId(), "789", pageRequest).isEmpty()).isFalse();
    }

    @Test
    void searchByElectionAndUser() {
        Election election = new Election();
        election.setCode(faker.code().toString());
        election.setTitle(faker.name().name());
        election.setDefaultTag(true);
        election.setElectionDate(LocalDate.of(2022, Month.AUGUST, 3));
        electionRepository.save(election);
        CountingBoard countingBoard = new CountingBoard();
        countingBoard.setElection(election);
        countingBoard.setDisplayOrder(1);
        countingBoard.setTitle("AVCB1");
        countingBoardRepository.save(countingBoard);
        Office office = new Office();
        office.setElection(election);
        office.setDisplayOrder(1);
        office.setTitle("Mayor");
        officeRepository.save(office);
        User user = new User();
        Optional<Role> role = roleRepository.findByName(ERole.ROLE_USER);
        if (role.isPresent()) {
            HashSet<Role> roles = new HashSet<>();
            roles.add(role.get());
            user.setRoles(roles);
        }
        user.setUsername("station1");
        user.setUserCode("123456");
        user.setPassword("123456");
        user.setElection(election);
        userRepository.save(user);

        WriteInRecord writeInRecord = new WriteInRecord();
        writeInRecord.setElection(election);
        writeInRecord.setUser(user);
        writeInRecord.setOffice(office);
        writeInRecord.setCountingBoard(countingBoard);
        String firstName = "john";
        String lastName = "smith";
        String middleName = "z";
        writeInRecord.setFirstName(firstName);
        writeInRecord.setLastName(lastName);
        writeInRecord.setMiddleName(middleName);
        writeInRecord.setCreatedAt(LocalDateTime.now());
        writeInRecord.setRecordCount(1);
        writeInRecord.setBatchNumber("789");
        underTest.save(writeInRecord);

        Pageable pageRequest = PageRequest.of(0, 5);

        assertThat(underTest.searchByElectionAndUser(election.getId(), user.getId(), "j", pageRequest).isEmpty()).isFalse();
        assertThat(underTest.searchByElectionAndUser(election.getId(), user.getId(), "smith", pageRequest).isEmpty()).isFalse();
        assertThat(underTest.searchByElectionAndUser(election.getId(), user.getId(), "t", pageRequest).isEmpty()).isFalse();
        assertThat(underTest.searchByElectionAndUser(election.getId(), user.getId(), "May", pageRequest).isEmpty()).isFalse();
        assertThat(underTest.searchByElectionAndUser(election.getId(), user.getId(), "AVC", pageRequest).isEmpty()).isFalse();
        assertThat(underTest.searchByElectionAndUser(election.getId(), user.getId(), "789", pageRequest).isEmpty()).isFalse();
    }
}