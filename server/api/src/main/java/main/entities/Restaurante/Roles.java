package main.entities.Restaurante;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "privilegios", schema = "buen_sabor")
public class Privilegios {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "tarea")
    private String tarea;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "permisos", joinColumns = @JoinColumn(name = "privilegio_id"))
    @Column(name = "permiso")
    private List<String> permisos = new ArrayList<>();

}