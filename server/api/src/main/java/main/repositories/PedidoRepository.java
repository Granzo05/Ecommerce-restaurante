package main.repositories;

import main.entities.Pedidos.EnumEstadoPedido;
import main.entities.Pedidos.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    @Query("SELECT p FROM Pedido p WHERE p.cliente.id = :id AND p.estado = :estado AND p.borrado = 'NO'")
    List<Pedido> findPedidosByEstadoAndIdCliente(@Param("estado") EnumEstadoPedido estado, @Param("id") long id);

    @Query("SELECT p FROM Pedido p WHERE p.cliente.id = :id AND p.estado != :estado AND p.borrado = 'NO'")
    List<Pedido> findPedidosByEstadosDistntosAndIdCliente(@Param("estado") EnumEstadoPedido estado, @Param("id") long id);

    @Query("SELECT p FROM Pedido p JOIN p.sucursales s WHERE s.id = :idSucursal")
    List<Pedido> findAllByIdSucursal(@Param("idSucursal") Long idSucursal);

    @Query("SELECT p FROM Pedido p JOIN p.sucursales s WHERE s.id = :idSucursal AND p.preferencia = :preference AND p.id = :idPedido")
    Optional<Pedido> findByIdPedidoAndPreferenceAndIdSucursal(@Param("idPedido") Long idPedido, @Param("preference") String preference, @Param("idSucursal") Long idSucursal);

    @Query("SELECT p FROM Pedido p WHERE p.preferencia = :preference")
    Optional<Pedido> findByPreference(@Param("preference") String preference);

    @Query("SELECT p FROM Pedido p JOIN p.sucursales s WHERE s.id = :idSucursal AND p.id = :idPedido")
    Optional<Pedido> findByIdAndIdSucursal(@Param("idPedido") Long idPedido, @Param("idSucursal") Long idSucursal);

    @Query("SELECT p FROM Pedido p WHERE p.preferencia = :preference AND p.id = :idPedido")
    Optional<Pedido> findByIdAndPreference(@Param("idPedido") Long idPedido, @Param("preference") String preference);

    @Query("SELECT p FROM Pedido p JOIN p.sucursales s WHERE p.estado = :estado AND s.id =:idSucursal")
    List<Pedido> findPedidosByEstadoAndIdSucursal(@Param("estado") EnumEstadoPedido estado, @Param("idSucursal") Long idSucursal);

    @Query("SELECT dp.articuloMenu.nombre AS nombreComida, SUM(dp.cantidad) AS cantidadTotal " +
            "FROM DetallesPedido dp " +
            "JOIN dp.pedido p " +
            "WHERE p.fechaPedido BETWEEN :fechaInicio AND :fechaFin " +
            "GROUP BY dp.articuloMenu.nombre " +
            "ORDER BY cantidadTotal DESC")
    List<Object[]> findTopComidasByFecha(@Param("fechaInicio") LocalDateTime fechaInicio, @Param("fechaFin") LocalDateTime fechaFin);



}

