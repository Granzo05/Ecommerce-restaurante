package main.entities.Restaurante;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Domicilio.Domicilio;
import net.minidev.json.annotate.JsonIgnore;

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
    @JsonIgnore
    @Column(name = "contraseña")
    private String contraseña;
    @Column(name = "cuil")
    private String cuil;
    @Column(name = "telefono")
    private Long telefono;
    @JsonIgnoreProperties(value = {"cliente", "sucursal", "empleado"}, allowSetters = true)
    @OneToMany(mappedBy = "empleado", cascade = CascadeType.ALL)
    private Set<Domicilio> domicilios = new HashSet<>();
    @JsonIgnoreProperties(value = {"empleado"}, allowSetters = true)
    @OneToMany(mappedBy = "empleado", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<FechaContratacionEmpleado> fechaContratacion = new HashSet<>();
    @Column(name = "fecha_nacimiento", nullable = false)
    private LocalDate fechaNacimiento;
    @JsonIgnore
    @Column(name = "borrado")
    private String borrado = "NO";
    @JsonIgnore
    @Column(name = "privilegios")
    private String privilegios;
    @JsonIgnoreProperties(value = {"empleados", "empresa", "stocksIngredientes", "stocksArticulo", "promociones", "localidadesDisponiblesDelivery", "articulosMenu", "articulosVenta", "medidas", "categorias", "imagenes", "ingredientes", "stocksEntranteSucursal"}, allowSetters = true)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_sucursal")
    private Sucursal sucursal;
}