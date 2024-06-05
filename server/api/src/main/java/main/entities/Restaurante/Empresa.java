package main.entities.Restaurante;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Productos.Imagenes;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "empresas", schema = "buen_sabor")
public class Empresa {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    @Column(name = "nombre")
    private String nombre;
    @Column(name = "cuit")
    private String cuit;
    @Column(name = "razon_social")
    private String razonSocial;
    @Column(name = "contraseña")
    private String contraseña;
    @Column(name = "borrado")
    private String borrado = "NO";
    @JsonIgnoreProperties(value = {"empleados", "empresa", "stocksIngredientes", "stocksArticulo", "promociones", "localidadesDisponiblesDelivery", "articulosMenu", "articulosVenta", "medidas", "categorias", "imagenes", "ingredientes", "stocksEntranteSucursal"}, allowSetters = true)
    @OneToMany(mappedBy = "empresa", cascade = CascadeType.ALL)
    private Set<Sucursal> sucursales = new HashSet<>();
    @JsonIgnoreProperties(value = {"empleados", "empresa", "stocksSucursal", "stocksEntranteSucursal", "promociones", "articulosMenu", "articulosVenta", "medidas", "categorias"}, allowSetters = true)
    @OneToMany(mappedBy = "empresa", fetch = FetchType.LAZY)
    private Set<Imagenes> imagenes = new HashSet<>();
}