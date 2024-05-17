package main.repositories;

import main.entities.Pedidos.DetallesPedido;
import main.entities.Pedidos.DetallesPedidoDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface DetallePedidoRepository extends JpaRepository<DetallesPedido, Long> {
    @Query("SELECT NEW main.entities.Pedidos.DetallesPedidoDTO(d.id, d.cantidad, d.subTotal, d.articuloMenu, d.articuloVenta) FROM DetallesPedido d WHERE d.pedido.id = :id")
    List<DetallesPedidoDTO> findByIdDTO(@Param("id") Long id);
}