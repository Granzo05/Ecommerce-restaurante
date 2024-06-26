package main.entities.Domicilio;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Cliente.Cliente;
import main.entities.Restaurante.Empleado;
import main.entities.Restaurante.Sucursal;
import org.hibernate.annotations.Cascade;

import java.io.Serializable;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "domicilios", schema = "buen_sabor")
public class Domicilio implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "calle")
    private String calle;

    @Column(name = "numero")
    private int numero;

    @Column(name = "codigo_postal")
    private int codigoPostal;

    @Column(name = "borrado")
    private String borrado = "NO";

    @Cascade(org.hibernate.annotations.CascadeType.DETACH)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_localidad")
    private Localidad localidad;

    @JsonIgnoreProperties(value = {"domicilios"}, allowSetters = true)
    @ManyToOne
    @JoinTable(
            name = "domicilios_clientes",
            joinColumns = @JoinColumn(name = "id_domicilio"),
            inverseJoinColumns = @JoinColumn(name = "id_cliente")
    )
    private Cliente cliente;

    @JsonIgnoreProperties(value = {"domicilios", "empleados", "empresa", "stocksIngredientes", "stocksArticulo", "promociones", "localidadesDisponiblesDelivery", "articulosMenu", "articulosVenta", "medidas", "categorias", "imagenes", "ingredientes", "stocksEntranteSucursal"}, allowSetters = true)
    @ManyToOne
    @JoinTable(
            name = "domicilios_sucursales",
            joinColumns = @JoinColumn(name = "id_domicilio"),
            inverseJoinColumns = @JoinColumn(name = "id_sucursal")
    )
    private Sucursal sucursal;

    @JsonIgnoreProperties(value = {"domicilios", "imagenes", "privilegios", "rolesEmpleado", "sucursales", "fechaContratacion"}, allowSetters = true)
    @ManyToOne
    @JoinTable(
            name = "domicilios_empleados",
            joinColumns = @JoinColumn(name = "id_domicilio"),
            inverseJoinColumns = @JoinColumn(name = "id_empleado")
    )
    private Empleado empleado;
}