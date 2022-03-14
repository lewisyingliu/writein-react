package com.example.writein.controllers;

import com.example.writein.models.entities.Election;
import com.example.writein.repository.ElectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

import static com.example.writein.utils.Constants.API_ENDPOINT;
import static com.example.writein.utils.Constants.SERVER_URL;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class ElectionController {

    @Autowired
    private ElectionRepository electionRepository;

    @GetMapping("/elections")
    public ResponseEntity<List<Election>> getAllElections() {
        try {
            List<Election> elections = electionRepository.findAll();
            if (elections.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(elections, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/elections/{id}")
    public ResponseEntity<Election> getElectionlById(@PathVariable("id") long id) {
        Optional<Election> electionData = electionRepository.findById(id);
        if (electionData.isPresent()) {
            return new ResponseEntity<>(electionData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/elections/defaultTag")
    public ResponseEntity<Election> findByDefaultTag() {
        try {
            List<Election> elections = electionRepository.findByDefaultTag(true);
            if (elections.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(elections.get(0), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/elections")
    public ResponseEntity<Election> createElection(@RequestBody Election election) {
        try {
            List<Election> otherElections = electionRepository.findAll();
            if (otherElections.isEmpty()) {
                election.setDefaultTag(true);
            } else {
                if (election.isDefaultTag()) {
                    otherElections.forEach(e -> {
                        e.setDefaultTag(false);
                        electionRepository.save(e);
                    });
                }
            }
            Election _Election = electionRepository.save(election);
            return new ResponseEntity<>(_Election, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/elections/{id}")
    public ResponseEntity<Election> updateElection(@PathVariable("id") Long id, @RequestBody Election election) {
        Optional<Election> electionOptional = electionRepository.findById(id);
        if (electionOptional.isPresent()) {
            Election _election = electionOptional.get();
            _election.setCode(election.getCode());
            _election.setTitle(election.getTitle());
            _election.setDefaultTag(election.isDefaultTag());
            _election.setElectionDate(election.getElectionDate());
            _election.setStatus(election.getStatus());
            List<Election> otherElections = electionRepository.findAll().stream().filter(e -> e.getId() != id).collect(Collectors.toList());
            if (_election.isDefaultTag() && otherElections.size() > 0) {
                otherElections.forEach(e -> {
                    e.setDefaultTag(false);
                    electionRepository.save(e);
                });
            }
            return new ResponseEntity<>(electionRepository.save(_election), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/elections/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteElection(@PathVariable("id") Long id) {
        try {
            electionRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/elections/deleteBatch")
    public ResponseEntity<HttpStatus> deleteByBatch(@RequestBody List<Long> ids) {
        try {
            electionRepository.deleteAllByIdInBatch(ids);
            AtomicReference<Boolean> hasDefaultTag = new AtomicReference<>(false);
            List<Election> elections = electionRepository.findAll();
            if (!elections.isEmpty()) {
                List<Election> inUseElections = elections.stream().filter(e -> e.isDefaultTag()).collect(Collectors.toList());
                if (inUseElections.isEmpty()) {
                    Election firstElection = elections.get(0);
                    firstElection.setDefaultTag(true);
                    electionRepository.save(firstElection);
                }
            }
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
