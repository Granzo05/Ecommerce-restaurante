package main.entities.Pedidos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import main.entities.Productos.ArticuloMenu;
import main.entities.Productos.ArticuloVenta;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DetallesPedidoDTO {
    private Long id;
    private int cantidad;
    private double subTotal;
    private ArticuloMenu articuloMenu;
    private ArticuloVenta articuloVenta;
}