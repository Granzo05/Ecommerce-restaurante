package main.entities.Stock;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import main.entities.Ingredientes.EnumMedida;
import main.entities.Restaurante.Sucursal;
import net.minidev.json.annotate.JsonIgnore;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class Stock {
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
    @Column(name = "medida")
    private EnumMedida medida;
    @JsonIgnore
    @Column(name = "borrado")
    private String borrado = "NO";
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sucursal")
    private Sucursal sucursal;

    public Stock(double precioCompra, int cantidadActual, int cantidadMinima, int cantidadMaxima, EnumMedida medida) {
        this.precioCompra = precioCompra;
        this.cantidadActual = cantidadActual;
        this.cantidadMinima = cantidadMinima;
        this.cantidadMaxima = cantidadMaxima;
        this.medida = medida;
    }
}
