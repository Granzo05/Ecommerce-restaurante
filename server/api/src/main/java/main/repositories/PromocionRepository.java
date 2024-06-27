package main.repositories;

import main.entities.Productos.Promocion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PromocionRepository extends JpaRepository<Promocion, Long> {

    @Query("SELECT p FROM Promocion p JOIN p.sucursales s WHERE s.id = :id AND :fechaActual BETWEEN p.fechaDesde AND p.fechaHasta")
    List<Promocion> findAllInTimeByIdSucursal(@Param("id") Long id, @Param("fechaActual") LocalDateTime fechaActual);

    @Query("SELECT p FROM Promocion p JOIN p.sucursales s WHERE s.id = :id")
    List<Promocion> findAllBySucursall(@Param("id") Long id);

    @Query("SELECT p FROM Promocion p JOIN p.sucursales s WHERE s.id = :id")
    List<Promocion> findAllByIdSucursal(@Param("id") Long id);

    @Query("SELECT p FROM Promocion p JOIN p.sucursales s WHERE s.id = :id AND p.nombre = :nombre")
    Optional<Promocion> findByNameAndIdSucursal(@Param("nombre") String nombre, @Param("id") Long id);

    @Query("SELECT p FROM Promocion p JOIN p.sucursales s WHERE s.id = :idSucursal AND p.id = :idPromocion")
    Optional<Promocion> findByIdPromocionAndIdSucursal(@Param("idPromocion") Long idPromocion, @Param("idSucursal") Long idSucursal);

}