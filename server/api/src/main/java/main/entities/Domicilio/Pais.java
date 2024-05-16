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
@JsonIgnoreProperties
@Table(name = "paises", schema = "buen_sabor")
public class Pais {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "nombre")
    private String nombre;
    @OneToMany(mappedBy = "pais", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<Provincia> provincias = new HashSet<>();

}