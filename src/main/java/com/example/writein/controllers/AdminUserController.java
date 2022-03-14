package com.example.writein.controllers;

import com.example.writein.models.ERole;
import com.example.writein.models.entities.User;
import com.example.writein.payload.response.MessageResponse;
import com.example.writein.repository.RoleRepository;
import com.example.writein.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import static com.example.writein.utils.Constants.API_ENDPOINT;
import static com.example.writein.utils.Constants.SERVER_URL;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class AdminUserController {

    @Autowired
    PasswordEncoder encoder;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;

    @GetMapping("/adminUsers")
    public ResponseEntity<List<User>> getAllAdminUsers() {
        try {
            List<User> adminUsers = userRepository.findAdminUser();
            if (adminUsers.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(adminUsers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/adminUsers/{id}")
    public ResponseEntity<User> getAdminUserlById(@PathVariable("id") long id) {
        Optional<User> userData = userRepository.findById(id);
        if (userData.isPresent()) {
            return new ResponseEntity<>(userData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/adminUser/{username}")
    public ResponseEntity<?> findUserByUsername(@PathVariable String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: This string is already taken!"));
        }
        return ResponseEntity.ok(new MessageResponse("This string is fine!"));
    }

    @PostMapping("/adminUsers")
    public ResponseEntity<User> createAdminUser(@RequestBody User user) {
        try {
            String password = user.getPassword();
            user.setRoles(Collections.singleton(roleRepository.findByName(ERole.ROLE_ADMIN).get()));
            user.setPassword(encoder.encode(password));
            User _User = userRepository.save(user);
            return new ResponseEntity<>(_User, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/adminUsers/{id}")
    public ResponseEntity<User> updateAdminUser(@PathVariable("id") Long id, @RequestBody User user) {
        Optional<User> userData = userRepository.findById(id);
        if (userData.isPresent()) {
            return new ResponseEntity<>(userRepository.save(user), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/adminUsers/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteAdminUser(@PathVariable("id") Long id) {
        try {
            userRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/adminUsers/deleteBatch")
    public ResponseEntity<HttpStatus> deleteInBatch(@RequestBody List<Long> ids) {
        try {
            userRepository.deleteAllByIdInBatch(ids);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
