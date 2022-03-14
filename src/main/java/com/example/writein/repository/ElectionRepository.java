package com.example.writein.repository;

import com.example.writein.models.entities.Election;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ElectionRepository extends JpaRepository<Election, Long> {

    List<Election> findByDefaultTag(boolean defaultTag);
    List<Election> findByTitleContaining(String title);
}