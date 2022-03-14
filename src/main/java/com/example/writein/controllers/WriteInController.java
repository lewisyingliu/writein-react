package com.example.writein.controllers;

import com.example.writein.dto.UserInput;
import com.example.writein.models.entities.User;
import com.example.writein.models.entities.WriteInRecord;
import com.example.writein.models.entities.Election;
import com.example.writein.payload.response.MessageResponse;
import com.example.writein.repository.UserRepository;
import com.example.writein.repository.WriteInRepository;
import com.example.writein.repository.ElectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import static com.example.writein.utils.Constants.API_ENDPOINT;
import static com.example.writein.utils.Constants.SERVER_URL;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class WriteInController {
    @Autowired
    private WriteInRepository writeInRepository;
    @Autowired
    private ElectionRepository electionRepository;
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/writeIns/elections/{electionId}/{userId}")
    public ResponseEntity<Map<String, Object>> getRecordsByElection(@PathVariable("electionId") Long electionId,
                                                                    @PathVariable("userId") Long userId,
                                                                    @RequestParam(required = false) String filter,
                                                                    @RequestParam(defaultValue = "0") int page,
                                                                    @RequestParam(defaultValue = "10") int size,
                                                                    @RequestParam(defaultValue = "createdAt,desc") String[] sort) {
        try {
            Optional<Election> electionOptional = electionRepository.findById(electionId);
            Optional<User> userOptional = userRepository.findById(userId);
            Election election = electionOptional.get();
            User user = userOptional.get();
            List<Order> orders = new ArrayList<Order>();
            if (sort[0].contains(",")) {
                for (String sortOrder : sort) {
                    String[] _sort = sortOrder.split(",");
                    orders.add(new Order(getSortDirection(_sort[1]), _sort[0]));
                }
            } else {
                orders.add(new Order(getSortDirection(sort[1]), sort[0]));
            }
            List<WriteInRecord> writeInRecords = new ArrayList<WriteInRecord>();
            Pageable pagingSort = PageRequest.of(page, size, Sort.by(orders));
            Page<WriteInRecord> pageWriteInRecords;
            if (filter == null) {
                pageWriteInRecords = writeInRepository.findByElectionAndUser(election, user, pagingSort);
            } else {
                pageWriteInRecords = writeInRepository.searchByElectionAndUser(election.getId(), user.getId(), filter, pagingSort);
            }
            writeInRecords = pageWriteInRecords.getContent();

            Map<String, Object> response = new HashMap<>();
            response.put("records", writeInRecords);
            response.put("currentPage", pageWriteInRecords.getNumber());
            response.put("totalItems", pageWriteInRecords.getTotalElements());
            response.put("totalPages", pageWriteInRecords.getTotalPages());

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/writeIns/elections/{id}")
    public ResponseEntity<WriteInRecord> createWriteInRecord(@PathVariable("id") Long id, @RequestBody WriteInRecord writeInRecord) {
        try {
            Optional<Election> electionOptional = electionRepository.findById(id);
            if (electionOptional.isPresent()) {
                writeInRecord.setElection(electionOptional.get());
                WriteInRecord _WriteInRecord = writeInRepository.save(writeInRecord);
                return new ResponseEntity<>(_WriteInRecord, HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/writeIns/{id}")
    public ResponseEntity<WriteInRecord> updateWriteIn(@PathVariable("id") Long id, @RequestBody WriteInRecord writeInRecord) {
        Optional<WriteInRecord> writeInRecordOptional = writeInRepository.findById(id);
        if (writeInRecordOptional.isPresent()) {
            WriteInRecord _writeInRecord = writeInRecordOptional.get();
            _writeInRecord.setOffice(writeInRecord.getOffice());
            _writeInRecord.setCountingBoard(writeInRecord.getCountingBoard());
            _writeInRecord.setBatchNumber(writeInRecord.getBatchNumber());
            _writeInRecord.setFirstName(writeInRecord.getFirstName());
            _writeInRecord.setMiddleName(writeInRecord.getMiddleName());
            _writeInRecord.setLastName(writeInRecord.getLastName());
            return new ResponseEntity<>(writeInRepository.save(_writeInRecord), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/writeIns/deleteBatch")
    public ResponseEntity<HttpStatus> deleteInBatch(@RequestBody List<Long> ids) {
        try {
            writeInRepository.deleteAllByIdInBatch(ids);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private Sort.Direction getSortDirection(String direction) {
        if (direction.equals("asc")) {
            return Sort.Direction.ASC;
        } else if (direction.equals("desc")) {
            return Sort.Direction.DESC;
        }
        return Sort.Direction.ASC;
    }
}
