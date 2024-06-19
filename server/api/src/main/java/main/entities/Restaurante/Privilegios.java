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

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "borrado")
    private String borrado = "NO";

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "permisos_sucursales", joinColumns = @JoinColumn(name = "id_privilegio"))
    @Column(name = "permiso")
    private List<String> permisos = new ArrayList<>();

    @JsonIgnoreProperties(value = {"empleados", "empresa", "stocksIngredientes", "stocksArticulo", "promociones", "localidadesDisponiblesDelivery", "articulosMenu", "articulosVenta", "medidas", "categorias", "imagenes", "ingredientes", "stocksEntranteSucursal"}, allowSetters = true)
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "privilegios_sucursales",
            joinColumns = @JoinColumn(name = "id_privilegio"),
            inverseJoinColumns = @JoinColumn(name = "id_sucursal")
    )
    private Set<Sucursal> sucursales = new HashSet<>();
}