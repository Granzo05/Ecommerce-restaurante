package main.repositories;

import main.entities.Restaurante.LocalidadDelivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocalidadDeliveryRepository extends JpaRepository<LocalidadDelivery, Long> {

    @Query("SELECT l FROM LocalidadDelivery l WHERE l.sucursal.id = :id")
    List<LocalidadDelivery> findByIdSucursal(@Param("id") Long id);
}