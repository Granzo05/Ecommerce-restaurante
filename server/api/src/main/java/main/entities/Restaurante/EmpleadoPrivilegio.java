package main.entities.Restaurante;


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
public class EmpleadoPrivilegio {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "empleado_id")
    private Empleado empleado;

    @ManyToOne
    @JoinColumn(name = "privilegio_id")
    private Privilegios privilegio;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "permisos_empleado", joinColumns = @JoinColumn(name = "empleado_privilegio_id"))
    @Column(name = "permiso")
    private List<String> permisos = new ArrayList<>();
}
