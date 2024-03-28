package main.repositories;

import main.entities.Pedidos.DetallesPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetallesPedidoRepository extends JpaRepository<DetallesPedido, Long> {
    @Query("SELECT d FROM DetallesPedido d WHERE d.pedido.id = :id")
    List<DetallesPedido> findByIdPedido(@Param("id") long id);

}

