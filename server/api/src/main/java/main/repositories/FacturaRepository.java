package main.repositories;

import main.entities.Factura.Factura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.HashSet;
import java.util.Optional;

@Repository
public interface FacturaRepository extends JpaRepository<Factura, Long> {
    @Query("SELECT f FROM Factura f WHERE f.pedido.cliente.id = :id ")
    HashSet<Factura> findByIdCliente(@Param("id") long id);

    @Query("SELECT f FROM Factura f WHERE f.id = :id")
    Optional<Factura> findById(@Param("id") long id);
}