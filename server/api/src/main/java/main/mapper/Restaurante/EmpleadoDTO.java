package main.entities.Restaurante;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Domicilio.Domicilio;
import main.entities.Productos.Imagenes;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Setter
@Getter
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

    @Column(name = "contraseña")
    private String contraseña;

    @Column(name = "cuil")
    private String cuil;

    @Column(name = "telefono")
    private Long telefono;

    @JsonIgnoreProperties(value = {"empleado", "cliente", "sucursal"}, allowSetters = true)
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "empleado", cascade = CascadeType.ALL)
    private Set<Domicilio> domicilios = new HashSet<>();

    @JsonIgnoreProperties(value = {"empleado"}, allowSetters = true)
    @OneToMany(mappedBy = "empleado", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<FechaContratacionEmpleado> fechaContratacion = new HashSet<>();

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Column(name = "borrado")
    private String borrado = "NO";

    @JsonIgnoreProperties(value = {"empleado"}, allowSetters = true)
    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(
            name = "empleados_privilegios",
            joinColumns = @JoinColumn(name = "id_empleado"),
            inverseJoinColumns = @JoinColumn(name = "id_privilegio")
    )
    private Set<PrivilegiosEmpleados> privilegios = new HashSet<>();

    @JsonIgnoreProperties(value = {"empleado"}, allowSetters = true)
    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(
            name = "empleados_roles",
            joinColumns = @JoinColumn(name = "id_empleado"),
            inverseJoinColumns = @JoinColumn(name = "id_rol")
    )
    private Set<RolesEmpleados> roles = new HashSet<>();

    @JsonIgnoreProperties(value = {"articuloMenu", "articuloVenta", "promocion", "empresa", "sucursal", "categoria", "empleados"}, allowSetters = true)
    @ManyToMany(mappedBy = "empleados", fetch = FetchType.EAGER)
    private Set<Imagenes> imagenes = new HashSet<>();

    @JsonIgnoreProperties(value = {"domicilios", "empleados", "empresa", "stocksIngredientes", "stocksArticulo", "promociones", "localidadesDisponiblesDelivery", "articulosMenu", "articulosVenta", "medidas", "categorias", "imagenes", "ingredientes", "stocksEntranteSucursal"}, allowSetters = true)
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "empleados_sucursales",
            joinColumns = @JoinColumn(name = "id_empleado"),
            inverseJoinColumns = @JoinColumn(name = "id_sucursal")
    )
    private Set<Sucursal> sucursales = new HashSet<>();

}