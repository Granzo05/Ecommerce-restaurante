package main.repositories;

import main.entities.Restaurante.LocalidadDelivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface LocalidadDeliveryRepository extends JpaRepository<LocalidadDelivery, Long> {

    @Query("SELECT l FROM LocalidadDelivery l WHERE l.sucursal.id = :id")
    List<LocalidadDelivery> findByIdSucursal(@Param("id") Long id);

    @Modifying
    @Transactional
    @Query("DELETE FROM LocalidadDelivery i WHERE i.sucursal.id = :id")
    void deleteAllBySucursalId(@Param("id") Long id);
}