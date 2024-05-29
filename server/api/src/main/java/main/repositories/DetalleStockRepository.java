package main.repositories;

import main.entities.Stock.DetalleStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleStockRepository extends JpaRepository<DetalleStock, Long> {
    @Query("SELECT d FROM DetalleStock d WHERE d.stockEntrante.id = :id")
    List<DetalleStock> findIngredienteByIdStock(@Param("id") Long id);

    @Query("SELECT d FROM DetalleStock d WHERE d.stockEntrante.id = :id")
    List<DetalleStock> findArticuloByIdStock(@Param("id") Long id);
}