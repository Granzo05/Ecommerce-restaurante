package main.entities.Domicilio;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.minidev.json.annotate.JsonIgnore;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@JsonIgnoreProperties(value = "localidades")
@Table(name = "departamentos", schema = "buen_sabor")
public class Departamento {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "nombre")
    private String nombre;
    @JsonIgnoreProperties(value="departamentos")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_provincia")
    private Provincia provincia;
    @OneToMany(mappedBy = "departamento", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<Localidad> localidades = new HashSet<>();
}