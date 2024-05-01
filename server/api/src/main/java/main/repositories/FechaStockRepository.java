package main.repositories;

import main.entities.Stock.FechaStock;
import main.entities.Stock.StockIngredientes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FechaStockRepository extends JpaRepository<FechaStock, Long> {

}