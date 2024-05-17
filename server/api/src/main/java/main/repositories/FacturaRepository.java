package main.repositories;

import main.entities.Factura.Factura;
import main.entities.Factura.FacturaDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FacturaRepository extends JpaRepository<Factura, Long> {
    @Query("SELECT NEW main.entities.Factura.FacturaDTO(f.id, f.tipoFactura, f.metodoPago, f.fechaFacturacion, f.total) FROM Factura f WHERE f.pedido.cliente.id = :id ")
    List<FacturaDTO> findByIdCliente(@Param("id") long id);

    @Query("SELECT NEW main.entities.Factura.FacturaDTO(f.id, f.tipoFactura, f.metodoPago, f.fechaFacturacion, f.total) FROM Factura f WHERE f.id = :id")
    Optional<FacturaDTO> findByIdDTO(@Param("id") long id);
}