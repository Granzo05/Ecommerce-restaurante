package main.entities.Restaurante;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "roles_empleados", schema = "buen_sabor")
public class RolesEmpleados {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "borrado")
    private String borrado = "NO";

    @JsonIgnoreProperties(value = {"sucursales"}, allowSetters = true)
    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "id_rol")
    private Roles rol;

    @JsonIgnoreProperties(value = {"domicilios", "imagenes", "privilegios", "roles", "sucursales", "fechaContratacion"}, allowSetters = true)
    @ManyToMany(mappedBy = "roles", fetch = FetchType.LAZY)
    private Set<Empleado> empleados = new HashSet<>();

}