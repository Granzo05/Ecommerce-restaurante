package main.entities.Pedidos;

import jakarta.persistence.*;
import lombok.*;
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