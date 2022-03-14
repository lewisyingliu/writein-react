package com.example.writein.models.entities;

import com.example.writein.models.EElection;
import com.example.writein.models.UserDateAudit;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;

@Entity
//@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Getter
@Setter
@NoArgsConstructor
@Table(name = "elections")
@EntityListeners(AuditingEntityListener.class)
public class Election extends UserDateAudit {

    @NotBlank
    @Size(max = 128)
    private String code;

    @NotBlank
    @Size(max = 128)
    private String title;

    @NotNull
    private LocalDate electionDate;

    private LocalDate advanceVoteDate;

    private LocalDate nominationPeriodDate;

    @NotNull
    private boolean defaultTag = false;

    private Integer serialNumber;

    @Enumerated(EnumType.STRING)
    @Column(length = 128)
    private EElection status = EElection.PrePublished;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "election_id", referencedColumnName = "id", insertable = false, updatable = false)
    private List<CountingBoard> countingBoards;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "election_id", referencedColumnName = "id", insertable = false, updatable = false)
    private List<Office> offices;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "election_id", referencedColumnName = "id", insertable = false, updatable = false)
    private List<User> users;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "election_id", referencedColumnName = "id", insertable = false, updatable = false)
    private List<WriteInRecord> writeInRecords;

}
