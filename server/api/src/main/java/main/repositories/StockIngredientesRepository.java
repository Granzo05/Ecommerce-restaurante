package main.repositories;

import main.entities.Stock.StockIngredientes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockIngredientesRepository extends JpaRepository<StockIngredientes, Long> {
    @Query("SELECT s FROM StockIngredientes s JOIN s.sucursales suc WHERE suc.id = :id")
    List<StockIngredientes> findAllByIdSucursal(@Param("id") Long id);

    @Query("SELECT s FROM StockIngredientes s JOIN s.sucursales suc WHERE s.ingrediente.nombre = :nombre AND suc.id = :idSucursal")
    Optional<StockIngredientes> findStockByIngredienteNameAndIdSucursal(@Param("nombre") String nombre, @Param("idSucursal") Long idSucursal);

    @Query("SELECT SUM(s.precioCompra) FROM StockIngredientes s JOIN s.sucursales suc WHERE s.ingrediente.nombre = :nombre AND suc.id = :idSucursal")
    double findCostoByNameIngredienteAndIdSucursal(@Param("nombre") String nombre, @Param("idSucursal") Long idSucursal);

    @Query("SELECT s FROM StockIngredientes s JOIN s.sucursales suc WHERE s.ingrediente.id = :id AND suc.id = :idSucursal")
    Optional<StockIngredientes> findByIdIngredienteAndIdSucursal(@Param("id") Long id, @Param("idSucursal") Long idSucursal);

    @Query("SELECT s FROM StockIngredientes s JOIN s.sucursales suc WHERE s.ingrediente.nombre = :nombre AND suc.id = :idSucursal")
    Optional<StockIngredientes> findByNameIngredienteAndIdSucursal(@Param("nombre") String nombre, @Param("idSucursal") Long idSucursal);

    @Query("SELECT s FROM StockIngredientes s JOIN s.sucursales suc WHERE s.id = :id AND suc.id = :idSucursal")
    Optional<StockIngredientes> findByIdAndIdSucursal(@Param("id") Long id, @Param("idSucursal") Long idSucursal);

}