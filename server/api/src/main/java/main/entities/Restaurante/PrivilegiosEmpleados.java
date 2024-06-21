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
@Table(name = "privilegios_empleados")
public class PrivilegiosEmpleados extends Privilegios {

    @JsonIgnoreProperties(value = {"domicilios", "imagenes", "privilegios", "rolesEmpleado", "sucursales", "fechaContratacion"}, allowSetters = true)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_empleado")
    private Empleado empleado;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "permisos_empleados", joinColumns = @JoinColumn(name = "id_privilegio"))
    @Column(name = "permiso")
    private List<String> permisos = new ArrayList<>();
}