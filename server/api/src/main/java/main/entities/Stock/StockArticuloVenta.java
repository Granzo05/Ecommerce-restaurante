package main.entities.Stock;

import jakarta.persistence.*;
import lombok.*;
import main.entities.Ingredientes.Ingrediente;
import main.entities.Pedidos.EnumMedida;
import main.entities.Productos.Articulo;
import main.entities.Productos.ArticuloVenta;
import main.entities.Restaurante.Sucursal;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "stock_articulos", schema = "buen_sabor")
public class StockArticuloVenta extends Stock {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @OneToOne
    @JoinColumn(name = "id_articulo")
    private ArticuloVenta articuloVenta;
    @OneToMany(mappedBy = "stockArticuloVenta", cascade = CascadeType.ALL)
    public Set<FechaStock> fechaIngreso = new HashSet<>();
    public StockArticuloVenta(int cantidadActual, int cantidadMinima, int cantidadMaxima, Sucursal sucursal, ArticuloVenta articuloVenta, EnumMedida medida, double precioCompra) {
        super(cantidadActual, cantidadMinima, cantidadMaxima, sucursal, medida, precioCompra);
        this.articuloVenta = articuloVenta;
    }
}