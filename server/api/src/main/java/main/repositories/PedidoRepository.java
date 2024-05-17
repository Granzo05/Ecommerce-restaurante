package main.repositories;

import main.entities.Pedidos.EnumEstadoPedido;
import main.entities.Pedidos.Pedido;
import main.entities.Pedidos.PedidoDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    @Query("SELECT NEW main.entities.Pedidos.PedidoDTO(p.id, p.tipoEnvio, p.estado, p.fechaPedido, p.horaFinalizacion, p.cliente.id) FROM Pedido p WHERE p.cliente.id = :id AND p.borrado = 'NO'")
    List<PedidoDTO> findOrderByIdCliente(@Param("id") long id);

    @Query("SELECT NEW main.entities.Pedidos.PedidoDTO(p.id, p.tipoEnvio, p.estado, p.fechaPedido, p.horaFinalizacion, p.cliente.id) FROM Pedido p WHERE p.borrado = 'NO'")
    List<PedidoDTO> findOrders();

    @Query("SELECT NEW main.entities.Pedidos.PedidoDTO(p.id, p.tipoEnvio, p.estado, p.fechaPedido, p.horaFinalizacion, p.cliente.id) FROM Pedido p WHERE p.estado = :estado AND p.borrado = 'NO'")
    List<PedidoDTO> findPedidos(EnumEstadoPedido estado);

}

