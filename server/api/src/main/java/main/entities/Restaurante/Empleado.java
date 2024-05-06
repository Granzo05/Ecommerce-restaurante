package main.entities.Restaurante;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Domicilio.Domicilio;
import net.minidev.json.annotate.JsonIgnore;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "empleados", schema = "buen_sabor")
public class Empleado {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "nombre")
    private String nombre;
    @Column(name = "email")
    private String email;
    @JsonIgnore
    @Column(name = "contraseña")
    private String contraseña;
    @Column(name = "cuil")
    private String cuil;
    @Column(name = "telefono")
    private Long telefono;
    @JsonIgnoreProperties(value = "empleado")
    @OneToMany(mappedBy = "empleado", cascade = CascadeType.ALL)
    private Set<Domicilio> domicilios = new HashSet<>();
    @JsonIgnoreProperties(value = "empleado")
    @OneToMany(mappedBy = "empleado", cascade = CascadeType.ALL)
    private Set<FechaContratacionEmpleado> fechaContratacion = new HashSet<>();
    @Column(name = "fecha_nacimiento", updatable = false, nullable = false)
    private Date fechaNacimiento;
    @JsonIgnore
    @Column(name = "borrado")
    private String borrado = "NO";
    @JsonIgnore
    @Column(name = "privilegios")
    private String privilegios;
    @JsonIgnoreProperties(value = "empleados")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sucursal")
    private Sucursal sucursal;
}