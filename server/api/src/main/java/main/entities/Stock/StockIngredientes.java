package main.entities.Stock;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Ingredientes.Ingrediente;
import main.entities.Ingredientes.Medida;
import main.entities.Restaurante.Sucursal;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@ToString
@Table(name = "stock_ingredientes", schema = "buen_sabor")
public class StockIngredientes {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @JsonIgnoreProperties(value = {"sucursales"}, allowSetters = true)
    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "id_ingrediente")
    private Ingrediente ingrediente;

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

    @JsonIgnoreProperties(value = {"domicilios", "empleados", "empresa", "stocksIngredientes", "stocksArticulo", "promociones", "localidadesDisponiblesDelivery", "articulosMenu", "articulosVenta", "medidas", "categorias", "imagenes", "ingredientes", "stocksEntranteSucursal"}, allowSetters = true)
    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    @JoinTable(
            name = "stock_ingredientes_sucursales",
            joinColumns = @JoinColumn(name = "id_stock"),
            inverseJoinColumns = @JoinColumn(name = "id_sucursal")
    )
    private Set<Sucursal> sucursales = new HashSet<>();

    @Transient
    private LocalDate fechaLlegadaProxima;
}
