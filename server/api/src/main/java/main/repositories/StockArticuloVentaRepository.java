package main.repositories;

import main.entities.Stock.Stock;
import main.entities.Stock.StockArticuloVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockArticuloVentaRepository extends JpaRepository<StockArticuloVenta, Long> {
    List<StockArticuloVenta> findAll();

    @Query("SELECT s FROM Stock s WHERE s.ingrediente.nombre = :nombre AND s.borrado = 'NO'")
    Optional<StockArticuloVenta> findStockByProductName(@Param("nombre") String nombre);

    @Query("SELECT s FROM Stock s WHERE s.ingrediente.id = :id")
    Optional<StockArticuloVenta> findByIdIngrediente(@Param("id") Long id);

}