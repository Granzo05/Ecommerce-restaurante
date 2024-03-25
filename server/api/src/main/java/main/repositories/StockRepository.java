package main.repositories;

import main.entities.Restaurante.Menu.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {
    List<Stock> findAll();
    @Query("SELECT s FROM Stock s WHERE s.ingrediente.nombre = :nombre AND s.borrado = :'NO'")
    Optional<Stock> findStockByProductName(@Param("nombre") String nombre);

}