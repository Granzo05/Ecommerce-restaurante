package main.entities.Restaurante;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "privilegios_empleados", schema = "buen_sabor")
public class PrivilegiosEmpleados {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @JsonIgnoreProperties(value = {"sucursales"}, allowSetters = true)
    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "id_privilegio")
    private Privilegios privilegio;

    @JsonIgnoreProperties(value = {"empleadoPrivilegios"}, allowSetters = true)
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "id_empleado")
    private Empleado empleado;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "permisos_empleados", joinColumns = @JoinColumn(name = "id_privilegio"))
    @Column(name = "permiso")
    private List<String> permisos = new ArrayList<>();

}