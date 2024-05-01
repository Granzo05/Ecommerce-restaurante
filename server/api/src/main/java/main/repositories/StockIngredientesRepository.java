package main.repositories;

import main.entities.Stock.Stock;
import main.entities.Stock.StockIngredientes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockIngredientesRepository extends JpaRepository<StockIngredientes, Long> {
    List<StockIngredientes> findAll();

    @Query("SELECT s FROM StockIngredientes s WHERE s.ingrediente.nombre = :nombre AND s.borrado = 'NO'")
    Optional<StockIngredientes> findStockByProductName(@Param("nombre") String nombre);

    @Query("SELECT s FROM StockIngredientes s WHERE s.ingrediente.id = :id")
    Optional<StockIngredientes> findByIdIngrediente(@Param("id") Long id);

}