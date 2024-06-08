package main.entities.Stock;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import main.entities.Ingredientes.Medida;
import main.entities.Productos.ArticuloVenta;
import main.entities.Restaurante.Sucursal;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "stock_articulos", schema = "buen_sabor")
public class StockArticuloVenta implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "precio_compra")
    private double precioCompra;

    @Column(name = "cantidad_actual")
    private int cantidadActual;

    @Column(name = "cantidad_minima")
    private int cantidadMinima;

    @Column(name = "cantidad_maxima")
    private int cantidadMaxima;

    @JsonIgnoreProperties(value = {"sucursales"}, allowSetters = true)
    @ManyToOne
    @JoinColumn(name = "id_medida")
    private Medida medida;

    @Column(name = "borrado")
    private String borrado = "NO";

    @JsonIgnoreProperties(value = {"sucursales"}, allowSetters = true)
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_articulo")
    private ArticuloVenta articuloVenta;

    @Transient
    private LocalDate fechaLlegadaProxima;

    @JsonIgnoreProperties(value = {"empleados", "empresa", "stocksIngredientes", "stocksArticulo", "promociones", "localidadesDisponiblesDelivery", "articulosMenu", "articulosVenta", "medidas", "categorias", "imagenes", "ingredientes", "stocksEntranteSucursal"}, allowSetters = true)
    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(
            name = "stock_articulos_sucursales",
            joinColumns = @JoinColumn(name = "id_stock"),
            inverseJoinColumns = @JoinColumn(name = "id_sucursal")
    )
    private Set<Sucursal> sucursales = new HashSet<>();
}