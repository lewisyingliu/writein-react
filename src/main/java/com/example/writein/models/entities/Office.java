package com.example.writein.models.entities;

import com.example.writein.models.DateAudit;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "offices")
@EntityListeners(AuditingEntityListener.class)
public class Office extends DateAudit {

    @NotBlank
    @Size(max = 128)
    private String title;

    @NotNull
    private Integer displayOrder;

    @ManyToOne
    @JoinColumn(name = "election_id")
    @JsonIgnore
    private Election election;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "offices_counting_boards", joinColumns = @JoinColumn(name = "offices_id"), inverseJoinColumns = @JoinColumn(name = "id"))
    private Set<CountingBoard> countingBoards = new HashSet<>();
}
