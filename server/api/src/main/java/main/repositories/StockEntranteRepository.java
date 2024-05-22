package main.repositories;

import main.entities.Stock.StockEntrante;
import main.entities.Stock.StockEntranteDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface StockEntranteRepository extends JpaRepository<StockEntrante, Long> {

    @Query("SELECT NEW main.entities.Stock.StockEntranteDTO(s.id, s.fechaLlegada) FROM StockEntrante s WHERE s.sucursal.id = :id AND s.borrado = 'NO'")
    List<StockEntranteDTO> findAllByIdSucursal(@Param("id") Long id);

    @Query("SELECT s FROM StockEntrante s WHERE s.id = :id AND s.sucursal.id = :idSucursal AND s.fechaLlegada = :fecha")
    Optional<StockEntrante> findByIdAndIdSucursalAndFecha(@Param("id") Long id, @Param("idSucursal") Long idSucursal, @Param("fecha") LocalDate fecha);

    @Query("SELECT s FROM StockEntrante s WHERE s.id = :id AND s.sucursal.id = :idSucursal")
    Optional<StockEntrante> findByIdAndIdSucursal(@Param("id") Long id, @Param("idSucursal") Long idSucursal);
}