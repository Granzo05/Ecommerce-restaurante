package main.entities.Stock;

import jakarta.persistence.*;
import lombok.*;
import main.entities.Ingredientes.Ingrediente;
import main.entities.Pedidos.EnumMedida;
import main.entities.Restaurante.Sucursal;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "stock_ingredientes", schema = "buen_sabor")
public class StockIngredientes extends Stock {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @OneToOne
    @JoinColumn(name = "id_ingrediente")
    private Ingrediente ingrediente;
    @OneToMany(mappedBy = "stockIngredientes", cascade = CascadeType.ALL)
    public Set<FechaStock> fechaIngreso = new HashSet<>();
    public StockIngredientes(int cantidadActual, int cantidadMinima, int cantidadMaxima, Sucursal sucursal, Ingrediente ingrediente, EnumMedida medida, double precioCompra) {
        super(cantidadActual, cantidadMinima, cantidadMaxima, sucursal, medida, precioCompra);
        this.ingrediente = ingrediente;
    }

    public StockIngredientes(int cantidadActual, int cantidadMinima, int cantidadMaxima, Sucursal sucursal) {
        super(cantidadActual, cantidadMinima, cantidadMaxima, sucursal);
    }

}
