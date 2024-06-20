package main.entities.Productos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Ingredientes.Categoria;
import main.entities.Ingredientes.Medida;
import main.entities.Ingredientes.Subcategoria;
import main.entities.Restaurante.Sucursal;
import main.entities.Stock.StockArticuloVenta;

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
public class ArticuloVenta implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @JsonIgnoreProperties(value = {"subcategorias", "sucursales", "imagenes"}, allowSetters = true)
    @ManyToOne
    @JoinColumn(name = "id_categoria")
    private Categoria categoria;

    @JsonIgnoreProperties(value = {"categoria", "sucursales"}, allowSetters = true)
    @ManyToOne
    @JoinColumn(name = "id_subcategoria")
    private Subcategoria subcategoria;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "precio_venta")
    private double precioVenta;

    @JsonIgnoreProperties(value = {"sucursales"}, allowSetters = true)
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_medida")
    private Medida medida;

    @Column(name = "cantidad_medida")
    private int cantidadMedida;

    @JsonIgnoreProperties(value = {"articuloMenu", "articuloVenta", "promocion", "empresa", "sucursal", "categoria"}, allowSetters = true)
    @ManyToMany(mappedBy = "articulosVenta", fetch = FetchType.EAGER)
    private Set<Imagenes> imagenes = new HashSet<>();

    @Column(name = "borrado")
    private String borrado = "NO";

    @JsonIgnoreProperties(value = {"empleados", "empresa", "stocksIngredientes", "stocksArticulo", "promociones", "localidadesDisponiblesDelivery", "articulosMenu", "articulosVenta", "medidas", "categorias", "imagenes", "ingredientes", "stocksEntranteSucursal"}, allowSetters = true)
    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(
            name = "articulos_venta_sucursales",
            joinColumns = @JoinColumn(name = "id_articulo"),
            inverseJoinColumns = @JoinColumn(name = "id_sucursal")
    )
    private Set<Sucursal> sucursales = new HashSet<>();

    @JsonIgnoreProperties(value = {"articuloVenta", "sucursales"}, allowSetters = true)
    @ManyToOne
    private StockArticuloVenta stockArticuloVenta;
}
