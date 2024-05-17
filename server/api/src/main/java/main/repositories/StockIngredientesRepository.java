package main.repositories;

import main.entities.Stock.StockIngredientes;
import main.entities.Stock.StockIngredientesDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockIngredientesRepository extends JpaRepository<StockIngredientes, Long> {
    @Query("SELECT NEW main.entities.Stock.StockIngredientesDTO(s.precioCompra, s.cantidadActual, s.cantidadMinima, s.cantidadMaxima, s.medida, s.id, s.ingrediente.nombre) FROM StockIngredientes s WHERE s.sucursal.id = :id AND s.borrado = 'NO'")
    List<StockIngredientesDTO> findAllByIdSucursal(@Param("id") Long id);

    @Query("SELECT s FROM StockIngredientes s WHERE s.ingrediente.nombre = :nombre AND s.borrado = 'NO'")
    Optional<StockIngredientes> findStockByProductName(@Param("nombre") String nombre);

    @Query("SELECT s FROM StockIngredientes s WHERE s.ingrediente.id = :id AND s.sucursal.id = :idSucursal")
    Optional<StockIngredientes> findByIdIngredienteAndIdSucursal(@Param("id") Long id, @Param("idSucursal") Long idSucursal);

    @Query("SELECT s FROM StockIngredientes s WHERE s.ingrediente.nombre = :nombre AND s.sucursal.id = :idSucursal")
    Optional<StockIngredientes> findByNameIngredienteAndIdSucursal(@Param("string") String nombre, @Param("idSucursal") Long idSucursal);

    @Query("SELECT s FROM StockIngredientes s WHERE s.id = :id AND s.sucursal.id = :idSucursal")
    Optional<StockIngredientes> findByIdAndIdSucursal(@Param("id") Long id, @Param("idSucursal") Long idSucursal);

}