package main.repositories;

import main.entities.Pedidos.EnumEstadoPedido;
import main.entities.Pedidos.Pedido;
import main.entities.Productos.ArticuloMenu;
import main.entities.Productos.ArticuloVenta;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Query("SELECT p FROM Pedido p WHERE p.fechaPedido BETWEEN :fechaDesde AND :fechaHasta ORDER BY p.fechaPedido ASC")
    Page<Pedido> findAllByFechasLimit(@Param("fechaDesde") LocalDate fechaDesde, @Param("fechaHasta") LocalDate fechaHasta, Pageable pageable);

    @Query("SELECT d.articuloVenta.nombre, COUNT(p) " +
            "FROM Pedido p JOIN p.detallesPedido d " +
            "GROUP BY d.articuloVenta.nombre")
    Page<ArticuloVenta> findAllArticulosVentaLimit(Pageable pageable);

    @Query("SELECT d.articuloMenu.nombre, COUNT(p) " +
            "FROM Pedido p JOIN p.detallesPedido d " +
            "GROUP BY d.articuloMenu.nombre")
    Page<ArticuloMenu> findAllArticulosMenuLimit(Pageable pageable);

    @Query("SELECT SUM(d.cantidad) " +
            "FROM Pedido p JOIN p.detallesPedido d " +
            "WHERE d.articuloVenta.nombre = :nombre " +
            "GROUP BY d.articuloVenta.nombre")
    Integer findTotalVentasArticulo(@Param("nombre") String nombre);

    @Query("SELECT SUM(d.cantidad) " +
            "FROM Pedido p JOIN p.detallesPedido d " +
            "WHERE d.articuloMenu.nombre = :nombre " +
            "GROUP BY d.articuloMenu.nombre")
    Integer findTotalVentasArticuloMenu(@Param("nombre") String nombre);

    @Query("SELECT p.fechaPedido, COUNT(p), d.articuloMenu.nombre " +
            "FROM Pedido p " +
            "JOIN p.detallesPedido d " +
            "JOIN p.sucursales s " +
            "WHERE s.id = :id " +
            "AND p.fechaPedido BETWEEN :fechaDesde AND :fechaHasta " +
            "GROUP BY p.fechaPedido, d.articuloMenu.nombre")
    Page<Object[]> findCantidadPedidosPorFechaYSucursal(Pageable pageable,
                                                        @Param("id") Long id,
                                                        @Param("fechaDesde") LocalDate fechaDesde,
                                                        @Param("fechaHasta") LocalDate fechaHasta);

    @Query("SELECT DATE_FORMAT(p.fechaPedido, '%Y-%m'), COUNT(p) " +
            "FROM Pedido p " +
            "JOIN p.detallesPedido d " +
            "JOIN p.sucursales s " +
            "WHERE s.id = :id AND p.cliente.id = :idCliente " +
            "AND p.fechaPedido BETWEEN :fechaInicio AND :fechaFin " +
            "GROUP BY DATE_FORMAT(p.fechaPedido, '%Y-%m')")
    Page<Object[]> findCantidadPedidosClientePorFechaYSucursal(Pageable pageable,
                                                               @Param("id") Long id,
                                                               @Param("idCliente") Long idCliente,
                                                               @Param("fechaInicio") LocalDate fechaInicio,
                                                               @Param("fechaFin") LocalDate fechaFin);

    @Query("SELECT DATE_FORMAT(p.fechaPedido, '%Y-%m') AS mesAnio, " +
            "SUM(CASE WHEN d.articuloMenu IS NOT NULL THEN d.cantidad * d.articuloMenu.precioVenta ELSE 0 END) + " +
            "SUM(CASE WHEN d.articuloVenta IS NOT NULL THEN d.cantidad * d.articuloVenta.precioVenta ELSE 0 END) AS totalIngresos " +
            "FROM Pedido p JOIN p.detallesPedido d JOIN p.sucursales s " +
            "WHERE s.id = :id " +
            "AND p.fechaPedido BETWEEN :fechaDesde AND :fechaHasta " +
            "GROUP BY DATE_FORMAT(p.fechaPedido, '%Y-%m')")
    Page<Object[]> findCantidadIngresosPorFechaYSucursal(Pageable pageable,
                                                         @Param("id") Long id,
                                                         @Param("fechaDesde") LocalDate fechaDesde,
                                                         @Param("fechaHasta") LocalDate fechaHasta);

    @Query("SELECT DATE_FORMAT(p.fechaPedido, '%Y-%m') AS mesAnio, " +
            "SUM(CASE WHEN d.articuloMenu IS NOT NULL THEN (d.articuloMenu.ganancia) ELSE 0 END) + " +
            "SUM(CASE WHEN d.articuloVenta IS NOT NULL THEN (d.cantidad * d.articuloVenta.precioVenta - d.articuloVenta.stockArticuloVenta.precioCompra * d.cantidad) ELSE 0 END) AS totalIngresos " +
            "FROM Pedido p " +
            "JOIN p.detallesPedido d " +
            "JOIN p.sucursales s " +
            "JOIN d.articuloMenu am " +
            "LEFT JOIN am.ingredientesMenu ingred " +
            "WHERE s.id = :id " +
            "AND p.fechaPedido BETWEEN :fechaDesde AND :fechaHasta " +
            "GROUP BY DATE_FORMAT(p.fechaPedido, '%Y-%m')")
    Page<Object[]> findCantidadGananciaPorFechaYSucursal(Pageable pageable,
                                                         @Param("id") Long id,
                                                         @Param("fechaDesde") LocalDate fechaDesde,
                                                         @Param("fechaHasta") LocalDate fechaHasta);


}

