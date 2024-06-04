package main.repositories;

import main.entities.Productos.DetallePromocion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface DetallePromocionRepository extends JpaRepository<DetallePromocion, Long> {

    @Modifying
    @Transactional
    @Query("DELETE FROM DetallePromocion d WHERE d.promocion.id = :id")
    void deleteAllByPromocionId(@Param("id") Long id);
}