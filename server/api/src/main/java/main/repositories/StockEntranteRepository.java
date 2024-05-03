package main.repositories;

import main.entities.Stock.DetalleStock;
import main.entities.Stock.StockEntrante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockEntranteRepository extends JpaRepository<StockEntrante, Long> {

}