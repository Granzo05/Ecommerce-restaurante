package main.repositories;

import main.entities.Stock.StockArticuloVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockArticuloVentaRepository extends JpaRepository<StockArticuloVenta, Long> {

    @Query("SELECT s FROM StockArticuloVenta s WHERE s.articuloVenta.nombre = :nombre AND s.sucursal.id = :idSucursal AND s.borrado = 'NO'")
    Optional<StockArticuloVenta> findStockByProductNameAndIdSucursal(@Param("nombre") String nombre, @Param("idSucursal") Long idSucursal);

    @Query("SELECT s FROM StockArticuloVenta s WHERE s.articuloVenta.id = :id AND s.sucursal.id = :idSucursal")
    Optional<StockArticuloVenta> findByIdArticuloAndIdSucursal(@Param("id") Long id, @Param("idSucursal") Long idSucursal);

    @Query("SELECT s FROM StockArticuloVenta s WHERE s.sucursal.id = :id AND s.borrado = 'NO'")
    List<StockArticuloVenta> findAllByIdSucursal(@Param("id") Long id);
}