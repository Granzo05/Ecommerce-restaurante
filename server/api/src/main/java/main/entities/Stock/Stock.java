package main.entities.Stock;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Ingredientes.Medida;
import main.entities.Restaurante.Sucursal;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class Stock implements Serializable {
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
    @JsonIgnoreProperties(value = {"empleados", "empresa", "stocksSucursal", "stocksEntranteSucursal", "promociones", "articulosMenu", "articulosVenta", "medidas", "categorias"}, allowSetters = true)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sucursal")
    private Sucursal sucursal;

    public Stock(double precioCompra, int cantidadActual, int cantidadMinima, int cantidadMaxima, Medida medida) {
        this.precioCompra = precioCompra;
        this.cantidadActual = cantidadActual;
        this.cantidadMinima = cantidadMinima;
        this.cantidadMaxima = cantidadMaxima;
        this.medida = medida;
    }
}
