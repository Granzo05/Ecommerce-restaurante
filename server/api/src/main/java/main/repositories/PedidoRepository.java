package main.repositories;

import main.entities.Pedidos.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    @Query("SELECT p FROM Pedido p WHERE p.cliente.id = :id AND p.borrado = 'NO'")
    List<Pedido> findOrderByIdCliente(@Param("id") long id);

    @Query("SELECT p FROM Pedido p WHERE p.borrado = 'NO'")
    List<Pedido> findOrders();

    @Query("SELECT p FROM Pedido p WHERE p.estado = :estado AND p.borrado = 'NO'")
    List<Pedido> findPedidos(String estado);

}

