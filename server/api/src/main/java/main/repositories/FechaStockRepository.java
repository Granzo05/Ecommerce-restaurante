package main.repositories;

import main.entities.Stock.DetalleStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FechaStockRepository extends JpaRepository<DetalleStock, Long> {

}