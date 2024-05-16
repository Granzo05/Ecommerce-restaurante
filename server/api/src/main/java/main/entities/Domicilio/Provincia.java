package main.entities.Domicilio;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "provincias", schema = "buen_sabor")
public class Provincia {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "nombre")
    private String nombre;
    @JsonIgnoreProperties({"provincias"})
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_pais")
    private Pais pais;
    @OneToMany(mappedBy = "provincia", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<Departamento> departamentos = new HashSet<>();
}