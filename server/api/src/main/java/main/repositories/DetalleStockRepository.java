package main.repositories;

import main.entities.Domicilio.DepartamentoDTO;
import main.entities.Stock.DetalleStock;
import main.entities.Stock.DetalleStockDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleStockRepository extends JpaRepository<DetalleStock, Long> {
    @Query("SELECT NEW main.entities.Stock.DetalleStockDTO(d.id, d.cantidad, d.medida, d.costoUnitario, d.subTotal, d.ingrediente.nombre, d.articuloVenta.nombre) FROM DetalleStock d WHERE d.stockEntrante.id = :id")
    List<DetalleStockDTO> findByIdStock(@Param("id") Long id);
}