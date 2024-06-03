package main.repositories;

import main.entities.Pedidos.EnumEstadoPedido;
import main.entities.Pedidos.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    @Query("SELECT p FROM Pedido p WHERE p.cliente.id = :id AND p.borrado = 'NO'")
    List<Pedido> findOrderByIdCliente(@Param("id") long id);

    @Query("SELECT p FROM Pedido p JOIN p.sucursales s WHERE s.id = :idSucursal")
    List<Pedido> findAllByIdSucursal(@Param("idSucursal") Long idSucursal);

    @Query("SELECT p FROM Pedido p JOIN p.sucursales s WHERE s.id = :idSucursal AND p.id = :idPedido")
    Optional<Pedido> findByIdAndIdSucursal(@Param("idPedido") Long idPedido, @Param("idSucursal") Long idSucursal);

    @Query("SELECT p FROM Pedido p JOIN p.sucursales s WHERE p.estado = :estado AND s.id =:idSucursal")
    List<Pedido> findPedidosByEstadoAndIdSucursal(@Param("estado") EnumEstadoPedido estado, @Param("idSucursal") Long idSucursal);

}

