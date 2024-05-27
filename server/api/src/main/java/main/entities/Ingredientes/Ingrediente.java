package main.entities.Ingredientes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Restaurante.Sucursal;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@ToString
@Table(name = "ingredientes", schema = "buen_sabor")
public class Ingrediente {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "nombre")
    private String nombre;
    @Column(name = "borrado")
    private String borrado = "NO";
    @JsonIgnoreProperties(value = {"domicilio", "empleados", "empresa", "stocksSucursal", "stocksEntranteSucursal", "localidadesDisponiblesDelivery", "promociones", "articulosMenu", "articulosVenta", "medidas", "categorias"})
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "medidas_sucursales",
            joinColumns = @JoinColumn(name = "id_medida"),
            inverseJoinColumns = @JoinColumn(name = "id_sucursal")
    )
    private Set<Sucursal> sucursales = new HashSet<>();
}