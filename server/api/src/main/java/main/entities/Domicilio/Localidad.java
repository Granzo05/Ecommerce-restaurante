package main.entities.Domicilio;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Restaurante.Sucursal;
import net.minidev.json.annotate.JsonIgnore;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@ToString
@Table(name = "localidades", schema = "buen_sabor")
public class Localidad {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "nombre")
    private String nombre;
    @JsonIgnoreProperties({"localidades"})
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_departamento")
    private Departamento departamento;
}