package main.repositories;

import main.entities.Stock.StockEntrante;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.awt.print.Pageable;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface StockEntranteRepository extends JpaRepository<StockEntrante, Long> {

    @Query("SELECT s FROM StockEntrante s JOIN s.sucursales suc WHERE suc.id = :id")
    List<StockEntrante> findAllByIdSucursal(@Param("id") Long id);

    @Query("SELECT s FROM StockEntrante s JOIN s.sucursales suc WHERE suc.id = :id AND s.estado = 'PENDIENTES'")
    List<StockEntrante> findAllPendientesByIdSucursal(@Param("id") Long id);

    @Query("SELECT s FROM StockEntrante s JOIN s.sucursales suc WHERE suc.id = :id AND s.estado = 'ENTREGADOS'")
    List<StockEntrante> findAllEntregadosByIdSucursal(@Param("id") Long id);

    @Query("SELECT s FROM StockEntrante s JOIN s.sucursales suc WHERE s.id = :id AND suc.id = :idSucursal AND s.fechaLlegada = :fecha")
    Optional<StockEntrante> findByIdAndIdSucursalAndFecha(@Param("id") Long id, @Param("idSucursal") Long idSucursal, @Param("fecha") LocalDate fecha);

    @Query("SELECT s FROM StockEntrante s JOIN s.sucursales suc WHERE suc.id = :idSucursal AND s.fechaLlegada = :fecha AND s.estado = 'PENDIENTES'")
    List<StockEntrante> findByIdSucursalAndFecha(@Param("idSucursal") Long idSucursal, @Param("fecha") LocalDate fecha);

    @Query("SELECT s FROM StockEntrante s JOIN s.sucursales suc WHERE s.id = :id AND suc.id = :idSucursal")
    Optional<StockEntrante> findByIdAndIdSucursal(@Param("id") Long id, @Param("idSucursal") Long idSucursal);

    @Query("SELECT s FROM StockEntrante s JOIN s.sucursales suc JOIN s.detallesStock det WHERE det.articuloVenta.id = :id AND suc.id = :idSucursal ORDER BY s.fechaLlegada ASC")
    Page<StockEntrante> findByIdArticuloAndIdSucursal(@Param("id") Long id, @Param("idSucursal") Long idSucursal, PageRequest pageable);

    @Query("SELECT s FROM StockEntrante s JOIN s.sucursales suc JOIN s.detallesStock det WHERE det.ingrediente.id = :id AND suc.id = :idSucursal ORDER BY s.fechaLlegada ASC")
    Page<StockEntrante> findByIdIngredienteAndIdSucursal(@Param("id") Long id, @Param("idSucursal") Long idSucursal, PageRequest pageable);


}