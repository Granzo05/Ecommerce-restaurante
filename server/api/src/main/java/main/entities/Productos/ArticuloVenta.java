package main.entities.Productos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Ingredientes.Categoria;
import main.entities.Ingredientes.Medida;
import main.entities.Ingredientes.Subcategoria;
import main.entities.Restaurante.Sucursal;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@ToString
@Table(name = "articulos_venta", schema = "buen_sabor")
public class ArticuloVenta extends Articulo implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @JsonIgnoreProperties(value = {"subcategorias", "sucursales"}, allowSetters = true)
    @ManyToOne
    @JoinColumn(name = "id_categoria")
    private Categoria categoria;
    @JsonIgnoreProperties(value = {"categoria", "sucursales"}, allowSetters = true)
    @ManyToOne
    @JoinColumn(name = "id_subcategoria")
    private Subcategoria subcategoria;
    @Column(name = "nombre")
    private String nombre;
    @JsonIgnoreProperties(value = {"sucursales"}, allowSetters = true)
    @ManyToOne
    @JoinColumn(name = "id_medida")
    private Medida medida;
    @Column(name = "cantidad_medida")
    private int cantidadMedida;
    @JsonIgnoreProperties(value = {"articuloMenu", "articuloVenta", "promocion", "empresa", "sucursal", "categoria"}, allowSetters = true)
    @OneToMany(mappedBy = "articuloVenta", fetch = FetchType.LAZY)
    private Set<Imagenes> imagenes = new HashSet<>();
    @Column(name = "borrado")
    private String borrado = "NO";
    @JsonIgnoreProperties(value = {"empleados", "empresa", "stocksSucursal", "stocksEntranteSucursal", "promociones", "localidadesDisponiblesDelivery", "articulosMenu", "articulosVenta", "medidas", "categorias"}, allowSetters = true)
    @ManyToMany(mappedBy = "articulosVenta", fetch = FetchType.LAZY)
    private Set<Sucursal> sucursales = new HashSet<>();
}
